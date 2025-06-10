export interface ComponentType {
  id: string;
  type: 'navigate-record' | 'set-field' | 'click-button' | 'verify-field' | 'verify-visibility' | 'condition' | 'wait';
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const componentTypes: ComponentType[] = [
  {
    id: 'navigate-record',
    type: 'navigate-record',
    label: 'Navigate to Record',
    description: 'Open a specific record or create new',
    icon: 'arrow-right',
    color: 'text-blue-600'
  },
  {
    id: 'set-field',
    type: 'set-field',
    label: 'Set Field Value',
    description: 'Update form field with specific value',
    icon: 'edit',
    color: 'text-green-600'
  },
  {
    id: 'click-button',
    type: 'click-button',
    label: 'Click Button',
    description: 'Click Save, Delete, or custom buttons',
    icon: 'mouse-pointer',
    color: 'text-orange-600'
  },
  {
    id: 'verify-field',
    type: 'verify-field',
    label: 'Verify Field Contains',
    description: 'Assert field has expected value',
    icon: 'check-circle',
    color: 'text-green-600'
  },
  {
    id: 'verify-visibility',
    type: 'verify-visibility',
    label: 'Verify Visibility',
    description: 'Check if element is visible/hidden',
    icon: 'eye',
    color: 'text-blue-600'
  },
  {
    id: 'condition',
    type: 'condition',
    label: 'Conditional Branch',
    description: 'If/then logic based on field values',
    icon: 'git-branch',
    color: 'text-orange-600'
  },
  {
    id: 'wait',
    type: 'wait',
    label: 'Wait/Delay',
    description: 'Pause execution for specified time',
    icon: 'clock',
    color: 'text-gray-600'
  }
];

export const buttonTypes = [
  { value: 'save', label: 'Save' },
  { value: 'delete', label: 'Delete' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'new', label: 'New' },
  { value: 'refresh', label: 'Refresh' },
  { value: 'custom', label: 'Custom Button' }
];

export const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater', label: 'Greater Than' },
  { value: 'less', label: 'Less Than' },
  { value: 'not-empty', label: 'Is Not Empty' },
  { value: 'empty', label: 'Is Empty' }
];

export const navigationActions = [
  { value: 'create', label: 'Create New Record' },
  { value: 'open', label: 'Open Existing Record' },
  { value: 'list', label: 'Navigate to List View' }
];
