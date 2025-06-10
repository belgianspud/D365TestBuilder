export interface D365Field {
  name: string;
  displayName: string;
  type: 'text' | 'lookup' | 'optionset' | 'currency' | 'datetime' | 'boolean' | 'memo';
  required: boolean;
  maxLength?: number;
  options?: Array<{ value: string; label: string }>;
  lookupEntity?: string;
}

export interface D365Entity {
  name: string;
  displayName: string;
  fields: D365Field[];
}

export const d365Entities: D365Entity[] = [
  {
    name: 'account',
    displayName: 'Account',
    fields: [
      {
        name: 'name',
        displayName: 'Account Name',
        type: 'text',
        required: true,
        maxLength: 160
      },
      {
        name: 'primarycontactid',
        displayName: 'Primary Contact',
        type: 'lookup',
        required: false,
        lookupEntity: 'contact'
      },
      {
        name: 'accountcategorycode',
        displayName: 'Category',
        type: 'optionset',
        required: false,
        options: [
          { value: '1', label: 'Preferred Customer' },
          { value: '2', label: 'Standard' },
          { value: '3', label: 'High Value' }
        ]
      },
      {
        name: 'revenue',
        displayName: 'Annual Revenue',
        type: 'currency',
        required: false
      },
      {
        name: 'websiteurl',
        displayName: 'Website',
        type: 'text',
        required: false,
        maxLength: 200
      },
      {
        name: 'telephone1',
        displayName: 'Main Phone',
        type: 'text',
        required: false,
        maxLength: 50
      },
      {
        name: 'statuscode',
        displayName: 'Status Reason',
        type: 'optionset',
        required: true,
        options: [
          { value: '1', label: 'Active' },
          { value: '2', label: 'Inactive' }
        ]
      }
    ]
  },
  {
    name: 'contact',
    displayName: 'Contact',
    fields: [
      {
        name: 'firstname',
        displayName: 'First Name',
        type: 'text',
        required: true,
        maxLength: 50
      },
      {
        name: 'lastname',
        displayName: 'Last Name',
        type: 'text',
        required: true,
        maxLength: 50
      },
      {
        name: 'emailaddress1',
        displayName: 'Email',
        type: 'text',
        required: false,
        maxLength: 100
      },
      {
        name: 'parentcustomerid',
        displayName: 'Company Name',
        type: 'lookup',
        required: false,
        lookupEntity: 'account'
      },
      {
        name: 'preferredcontactmethodcode',
        displayName: 'Preferred Method of Contact',
        type: 'optionset',
        required: false,
        options: [
          { value: '1', label: 'Any' },
          { value: '2', label: 'Email' },
          { value: '3', label: 'Phone' },
          { value: '4', label: 'Fax' },
          { value: '5', label: 'Mail' }
        ]
      }
    ]
  },
  {
    name: 'opportunity',
    displayName: 'Opportunity',
    fields: [
      {
        name: 'name',
        displayName: 'Topic',
        type: 'text',
        required: true,
        maxLength: 300
      },
      {
        name: 'customerid',
        displayName: 'Potential Customer',
        type: 'lookup',
        required: true,
        lookupEntity: 'account'
      },
      {
        name: 'estimatedvalue',
        displayName: 'Est. Revenue',
        type: 'currency',
        required: false
      },
      {
        name: 'closeprobability',
        displayName: 'Probability',
        type: 'text',
        required: false
      },
      {
        name: 'salesstage',
        displayName: 'Sales Stage',
        type: 'optionset',
        required: false,
        options: [
          { value: '0', label: 'Qualify' },
          { value: '1', label: 'Develop' },
          { value: '2', label: 'Propose' },
          { value: '3', label: 'Close' }
        ]
      }
    ]
  }
];

export function getEntityByName(entityName: string): D365Entity | undefined {
  return d365Entities.find(entity => entity.name === entityName);
}

export function getFieldByName(entityName: string, fieldName: string): D365Field | undefined {
  const entity = getEntityByName(entityName);
  return entity?.fields.find(field => field.name === fieldName);
}

export function getEntityOptions() {
  return d365Entities.map(entity => ({
    value: entity.name,
    label: entity.displayName
  }));
}

export function getFieldOptions(entityName: string) {
  const entity = getEntityByName(entityName);
  return entity?.fields.map(field => ({
    value: field.name,
    label: `${field.displayName} (${field.type})`
  })) || [];
}

export function getLookupOptions(lookupEntity: string) {
  // Mock lookup data for demonstration
  const mockData: Record<string, Array<{ value: string; label: string }>> = {
    account: [
      { value: 'account-1', label: 'Contoso Ltd' },
      { value: 'account-2', label: 'Fabrikam Inc' },
      { value: 'account-3', label: 'Adventure Works' }
    ],
    contact: [
      { value: 'contact-1', label: 'John Doe' },
      { value: 'contact-2', label: 'Jane Smith' },
      { value: 'contact-3', label: 'Bob Johnson' }
    ]
  };
  
  return mockData[lookupEntity] || [];
}
