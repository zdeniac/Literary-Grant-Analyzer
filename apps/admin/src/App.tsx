import { Admin, Resource } from 'react-admin';
import { OrganizationList } from './pages/organizations/list';
import { OrganizationEdit } from './pages/organizations/edit';
import { OrganizationCreate } from './pages/organizations/create';
import { JournalList } from './pages/journals/list';
import { JournalCreate } from './pages/journals/create';
import { JournalEdit } from './pages/journals/edit';
import { CustomLayout } from './CustomLayout';
import ArticleIcon from '@mui/icons-material/Article';
import BusinessIcon from "@mui/icons-material/Business";
import { DecisionAuthorityList } from './pages/decision-authorities/list';
import { DecisionAuthorityCreate } from './pages/decision-authorities/create';
import { DecisionAuthorityEdit } from './pages/decision-authorities/edit';
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { AwardSchemeList } from './pages/award-schemes/list';
import { AwardSchemeCreate } from './pages/award-schemes/create';
import { AwardSchemeEdit } from './pages/award-schemes/edit';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { SourceDocumentList } from './pages/source-documents/list';
import { SourceDocumentEdit } from './pages/source-documents/edit';
import { SourceDocumentCreate } from './pages/source-documents/create';
import SourceIcon from '@mui/icons-material/Source';
import dataProvider from './data-provider';
import { AwardDecisionList } from './pages/award-decisions/list';
import { AwardDecisionCreate } from './pages/award-decisions/create';
import { AwardDecisionEdit } from './pages/award-decisions/edit';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { ImportJobList } from './pages/import-jobs/list';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { PersonList } from './pages/person/list';
import { PersonEdit } from './pages/person/edit';
import { PersonCreate } from './pages/person/create';
import PersonIcon from '@mui/icons-material/Person';
import { ImportJobShow } from './pages/import-jobs/show';

const App = () => (
	<Admin layout={CustomLayout} dataProvider={dataProvider} >
		<Resource 
			name="organizations" 
			list={OrganizationList}
			edit={OrganizationEdit}
			create={OrganizationCreate}
			icon={BusinessIcon}
		/>
		<Resource 
			name="persons" 
			list={PersonList}
			edit={PersonEdit}
			create={PersonCreate}
			icon={PersonIcon}
		/>
		<Resource
			name="journals"
			list={JournalList}
			create={JournalCreate}
			edit={JournalEdit}
			icon={ArticleIcon}
		/>
		<Resource
			name="decision-authorities"
			list={DecisionAuthorityList}
			create={DecisionAuthorityCreate}
			edit={DecisionAuthorityEdit}
			icon={SupervisorAccountIcon}
		/>
		<Resource
			name="award-schemes"
			list={AwardSchemeList}
			create={AwardSchemeCreate}
			edit={AwardSchemeEdit}
			icon={EmojiEventsIcon}
		/>
		<Resource
			name="source-documents"
			list={SourceDocumentList}
			create={SourceDocumentCreate}
			edit={SourceDocumentEdit}
			icon={SourceIcon}
		/>
		<Resource
			name="award-decisions"
			list={AwardDecisionList}
			create={AwardDecisionCreate}
			edit={AwardDecisionEdit}
			icon={MilitaryTechIcon}
		/>

		<Resource
			name="import-jobs"
			list={ImportJobList}
			show={ImportJobShow}
			icon={FilePresentIcon}
		/>
	</Admin>
);

export default App;
