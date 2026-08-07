import type { CreateParams, CreateResult, DataProvider, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult, GetListResult, GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, GetOneParams, GetOneResult, Identifier, QueryFunctionContext, RaRecord, UpdateManyParams, UpdateManyResult, UpdateParams, UpdateResult } from "react-admin";
import { request } from "./request";

const dataProvider: DataProvider = {
	getList: async <RecordType extends RaRecord = RaRecord>(
		resource: string
	): Promise<GetListResult<RecordType>> => {
		const res = await request(`/api/${resource}`);
		return {
			data: res.data,
			total: res.total,
		};
	},
	getOne: async <RecordType extends RaRecord = RaRecord>(
		resource: string,
		params: GetOneParams<RecordType>
	): Promise<GetOneResult<RecordType>> => {
		const res = await request(`/api/${resource}/${params.id}`);
		return {
			data: res.data,
		};
	},
	getMany: async function <RecordType extends RaRecord = any>(resource: string, params: GetManyParams<RecordType> & QueryFunctionContext): Promise<GetManyResult<RecordType>> {
		const res = await request(`/api/${resource}`);
		return {
			data: res.data,
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