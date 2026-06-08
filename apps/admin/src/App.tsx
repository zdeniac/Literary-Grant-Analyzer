import './App.css';
import { Admin, Layout, Resource } from 'react-admin';
import { OrganizationList } from './pages/organizations/organization.list';
import simpleRestProvider from 'ra-data-simple-rest';

const dataProvider = simpleRestProvider('http://localhost:3000');

const App = () => (
	<Admin layout={Layout} dataProvider={dataProvider}>
		<Resource 
			name="organizations" 
			list={OrganizationList} 
		/>
	</Admin>
);

export default App;
