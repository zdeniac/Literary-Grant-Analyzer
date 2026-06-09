import './App.css';
import { Admin, Layout, Resource, type DataProvider } from 'react-admin';
import { OrganizationList } from './pages/organizations/organization.list';

const dataProvider: DataProvider = {
	getList: async (resource: string): Promise<{ data: Array<{ id: number | string}>, total: number }> => {
		const res = await fetch(`/api/${resource}`);

		if (!res.ok) {
      		throw new Error(await res.text());
    	}

		const json = await res.json();
		
		return {
  			data: json.data,
			total: json.total,
    	};
	}
};

const App = () => (
	<Admin layout={Layout} dataProvider={dataProvider}>
		<Resource 
			name="organizations" 
			list={OrganizationList}
		/>
	</Admin>
);

export default App;
