import { 
    DateInput, 
    minValue, 
    NumberInput, 
    ReferenceInput, 
    required, 
    SelectInput, 
    SimpleForm, 
    TextInput 
} from "react-admin";

const validateAwardScheme = [required()];
const validateDecisionMaker = [required()];
const validateRecipient = [required()];
const validateSourceDocument = [required()];

const validateAmount = [minValue(0)];

const validateDecisionDate = [required()];

export const AwardDecisionForm = () => (
    <SimpleForm>

        <ReferenceInput
            source="awardSchemeId"
            reference="award-schemes"
        >
            <SelectInput 
                optionText="name"
                validate={validateAwardScheme}
             />
        </ReferenceInput>

        <ReferenceInput
            source="decisionMakerId"
            reference="decision-makers"
        >
            <SelectInput 
                optionText="name"
                validate={validateDecisionMaker}
            />
        </ReferenceInput>

        <ReferenceInput
            source="recipientId"
            reference="recipients"
        >
            <SelectInput 
                optionText="name"
                validate={validateRecipient}
            />
        </ReferenceInput>

        <ReferenceInput
            source="sourceDocumentId"
            reference="source-documents"
        >
            <SelectInput 
                optionText="title"
                validate={validateSourceDocument}
            />
        </ReferenceInput>

        <NumberInput 
            source="amount"
            validate={validateAmount}
        />

        <TextInput source="purpose" />

        <TextInput source="sourceIdentifier" />

        <DateInput 
            source="decisionDate"
            validate={validateDecisionDate}
        />

    </SimpleForm>
);