import './App.css';
import { Admin, Layout, Resource, type CreateParams, type CreateResult, type DataProvider, type DeleteManyParams, type DeleteManyResult, type DeleteParams, type DeleteResult, type GetListParams, type GetListResult, type GetManyParams, type GetManyReferenceParams, type GetManyReferenceResult, type GetManyResult, type GetOneParams, type GetOneResult, type Identifier, type QueryFunctionContext, type RaRecord, type UpdateManyParams, type UpdateManyResult, type UpdateParams, type UpdateResult } from 'react-admin';
import { OrganizationList } from './pages/organizations/organization.list';
import { OrganizationEdit } from './pages/organizations/organization.edit';
import { OrganizationCreate } from './pages/organizations/organization.create';

const dataProvider: DataProvider = {
	getList: async <RecordType extends RaRecord = RaRecord>(
		resource: string
	): Promise<GetListResult<RecordType>> => {
		const res = await fetch(`/api/${resource}`);

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const json = await res.json();

		return {
			data: json.data,
			total: json.total,
		};
	},
	getOne: async <RecordType extends RaRecord = RaRecord>(
		resource: string,
		params: GetOneParams<RecordType>
	): Promise<GetOneResult<RecordType>> => {
		const res = await fetch(`/api/${resource}/${params.id}`);

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const json = await res.json();

		return {
			data: json.data,
		};
	},
	getMany: async function <RecordType extends RaRecord = any>(resource: string, params: GetManyParams<RecordType> & QueryFunctionContext): Promise<GetManyResult<RecordType>> {
		throw new Error('Function not implemented.');
	},
	getManyReference: function <RecordType extends RaRecord = any>(resource: string, params: GetManyReferenceParams & QueryFunctionContext): Promise<GetManyReferenceResult<RecordType>> {
		throw new Error('Function not implemented.');
	},
	update: async function <RecordType extends RaRecord = any>(resource: string, params: UpdateParams): Promise<UpdateResult<RecordType>> {
		const res = await fetch(`/api/${resource}/${params.id}`, {
			method: 'PUT',
			body: JSON.stringify(params.data),
			headers: {
				'Content-Type': 'application/json',
			}
		});

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const json = await res.json();

		return {
			data: json.data,
		};
	},
	updateMany: function <RecordType extends RaRecord = any>(resource: string, params: UpdateManyParams): Promise<UpdateManyResult<RecordType>> {
		throw new Error('Function not implemented.');
	},
	create: async function <RecordType extends Omit<RaRecord, 'id'> = any, ResultRecordType extends RaRecord = RecordType & { id: Identifier; }>(resource: string, params: CreateParams): Promise<CreateResult<ResultRecordType>> {
		const res = await fetch(`/api/${resource}/`, {
			method: 'POST',
			body: JSON.stringify(params.data),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const json = await res.json();

		return {
			data: json.data,
		};
	},
	delete: async function <RecordType extends RaRecord = any>(resource: string, params: DeleteParams<RecordType>): Promise<DeleteResult<RecordType>> {
		const res = await fetch(`/api/${resource}/${params.id}`, {
			method: 'DELETE',
		});

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const json = await res.json();

		return {
			data: json.data,
		};		
	},
	deleteMany: function <RecordType extends RaRecord = any>(resource: string, params: DeleteManyParams<RecordType>): Promise<DeleteManyResult<RecordType>> {
		throw new Error('Function not implemented.');
	}
}

const App = () => (
	<Admin layout={Layout} dataProvider={dataProvider}>
		<Resource 
			name="organizations" 
			list={OrganizationList}
			edit={OrganizationEdit}
			create={OrganizationCreate}
		/>
	</Admin>
);

export default App;
