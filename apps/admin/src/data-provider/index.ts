import type { CreateParams, CreateResult, DataProvider, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult, GetListParams, GetListResult, GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, GetOneParams, GetOneResult, Identifier, QueryFunctionContext, RaRecord, UpdateManyParams, UpdateManyResult, UpdateParams, UpdateResult } from "react-admin";
import { request } from "./request";
import { resourceToSortableEntity, validSortableFields } from "../../../packages/shared/constants";
import { type ResourceName, type SortableEntityName } from "../../../packages/shared/types";

const dataProvider: DataProvider = {
	getList: async <RecordType extends RaRecord = RaRecord>(
		resource: string,
		params: GetListParams & QueryFunctionContext
	): Promise<GetListResult<RecordType>> => {
		const query = new URLSearchParams();

		// Pagination
		query.set('page', String(params?.pagination?.page));
		query.set('perPage', String(params?.pagination?.perPage));

		// Sort
		if (params.sort?.field) {
			const field = params.sort.field;
			// Prepare the entity's name from the resource to validate the sortable fields
			let entityName: SortableEntityName | undefined = resourceToSortableEntity[resource as ResourceName];

			if (entityName && validSortableFields[entityName].includes(field)) {
				query.set('sort', String(field));
				query.set('order', String(params.sort.order));
			}
		}

		// Filters
		Object.entries(params.filter).forEach(([key, value]) => {
			if (value === undefined || value === null || value === '') {
        		return;
    		}

			if (Array.isArray(value)) {
				query.set(key, value.join(','));
				return;
			}

			query.set(key, String(value));
		});

		const res = await request(`/api/${resource}?${query.toString()}`);
		
		return {
			data: res.data,
			total: res.total,
		};
	},
	getOne: async <RecordType extends RaRecord = RaRecord>(
		resource: string,
		params: GetOneParams<RecordType>
	): Promise<GetOneResult<RecordType>> => {
		return {
			data: (await request(`/api/${resource}/${params.id}`)).data,
		};
	},
	getMany: async function <RecordType extends RaRecord = any>(
		resource: string, 
		params: GetManyParams<RecordType> & QueryFunctionContext
	): Promise<GetManyResult<RecordType>> {
		return {
			data: (await request(`/api/${resource}`)).data,
		};
	},
	getManyReference: function <RecordType extends RaRecord = any>(resource: string, params: GetManyReferenceParams & QueryFunctionContext): Promise<GetManyReferenceResult<RecordType>> {
		throw new Error('Function not implemented.');
	},
	update: async function <RecordType extends RaRecord = any>(resource: string, params: UpdateParams): Promise<UpdateResult<RecordType>> {		
		const res = await request(`/api/${resource}/${params.id}`, {
			method: 'PATCH',
			body: JSON.stringify(params.data),
			headers: {
				'Content-Type': 'application/json',
			}
		});
		return {
			data: res.data,
		};
	},
	updateMany: function <RecordType extends RaRecord = any>(resource: string, params: UpdateManyParams): Promise<UpdateManyResult<RecordType>> {
		throw new Error('Function not implemented.');
	},
	create: async function <RecordType extends Omit<RaRecord, 'id'> = any, ResultRecordType extends RaRecord = RecordType & { id: Identifier; }>(resource: string, params: CreateParams): Promise<CreateResult<ResultRecordType>> {
		const res = await request(`/api/${resource}/`, {
			method: 'POST',
			body: JSON.stringify(params.data),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return {
			data: res.data,
		};
	},
	delete: async function <RecordType extends RaRecord = any>(resource: string, params: DeleteParams<RecordType>): Promise<DeleteResult<RecordType>> {
		const res = await request(`/api/${resource}/${params.id}`, {
			method: 'DELETE',
		});
		return {
			data: res.data,
		};		
	},
	deleteMany: function <RecordType extends RaRecord = any>(resource: string, params: DeleteManyParams<RecordType>): Promise<DeleteManyResult<RecordType>> {
		throw new Error('Function not implemented.');
	}
}

export default dataProvider;