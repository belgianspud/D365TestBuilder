import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MousePointer, Check, Trash2 } from "lucide-react";
import { getEntityOptions, getFieldOptions, getFieldByName, getLookupOptions } from "@/lib/d365-metadata";
import { buttonTypes, operators, navigationActions } from "@/lib/flow-types";
import type { FlowNode } from "@shared/schema";

interface PropertiesPanelProps {
  selectedNode: FlowNode | null;
  onNodeUpdate: (node: FlowNode) => void;
}

export default function PropertiesPanel({ selectedNode, onNodeUpdate }: PropertiesPanelProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (selectedNode) {
      setFormData(selectedNode.data);
    } else {
      setFormData({});
    }
  }, [selectedNode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleApplyChanges = () => {
    if (selectedNode) {
      const updatedNode: FlowNode = {
        ...selectedNode,
        data: { ...selectedNode.data, ...formData }
      };
      onNodeUpdate(updatedNode);
    }
  };

  const handleDeleteNode = () => {
    // This would need to be implemented to remove the node from the flow
    console.log("Delete node:", selectedNode?.id);
  };

  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center text-center text-gray-500 py-8">
        <div>
          <MousePointer className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Select a step in the flow to configure its properties</p>
        </div>
      </div>
    );
  }

  const entityOptions = getEntityOptions();
  const fieldOptions = formData.entity ? getFieldOptions(formData.entity) : [];
  const selectedField = formData.entity && formData.field ? getFieldByName(formData.entity, formData.field) : null;

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1">{selectedNode.data.label}</h3>
        <p className="text-xs text-gray-600">Configure step settings</p>
      </div>
      
      <div className="space-y-6">
          {/* Navigate to Record Properties */}
          {selectedNode.type === 'navigate-record' && (
            <>
              <div>
                <Label htmlFor="action">Action Type</Label>
                <Select value={formData.action || ''} onValueChange={(value) => handleInputChange('action', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {navigationActions.map(action => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="entity">Entity</Label>
                <Select value={formData.entity || ''} onValueChange={(value) => handleInputChange('entity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityOptions.map(entity => (
                      <SelectItem key={entity.value} value={entity.value}>
                        {entity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.action === 'open' && (
                <div>
                  <Label htmlFor="recordId">Record ID</Label>
                  <Input
                    id="recordId"
                    value={formData.recordId || ''}
                    onChange={(e) => handleInputChange('recordId', e.target.value)}
                    placeholder="Enter GUID or leave empty for new record"
                  />
                </div>
              )}
            </>
          )}

          {/* Set Field Value Properties */}
          {selectedNode.type === 'set-field' && (
            <>
              <div>
                <Label htmlFor="entity">Target Entity</Label>
                <Select value={formData.entity || ''} onValueChange={(value) => handleInputChange('entity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityOptions.map(entity => (
                      <SelectItem key={entity.value} value={entity.value}>
                        {entity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.entity && (
                <div>
                  <Label htmlFor="field">Field Name</Label>
                  <Select value={formData.field || ''} onValueChange={(value) => handleInputChange('field', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.field && (
                <div>
                  <Label htmlFor="value">Value</Label>
                  {selectedField?.type === 'optionset' ? (
                    <Select value={formData.value || ''} onValueChange={(value) => handleInputChange('value', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedField.options?.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : selectedField?.type === 'lookup' ? (
                    <Select value={formData.value || ''} onValueChange={(value) => handleInputChange('value', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lookup value" />
                      </SelectTrigger>
                      <SelectContent>
                        {getLookupOptions(selectedField.lookupEntity || '').map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : selectedField?.type === 'memo' ? (
                    <Textarea
                      id="value"
                      value={formData.value || ''}
                      onChange={(e) => handleInputChange('value', e.target.value)}
                      placeholder="Enter field value"
                      rows={3}
                    />
                  ) : (
                    <Input
                      id="value"
                      value={formData.value || ''}
                      onChange={(e) => handleInputChange('value', e.target.value)}
                      placeholder="Enter field value"
                      type={selectedField?.type === 'currency' ? 'number' : 'text'}
                    />
                  )}
                </div>
              )}

              {selectedField && (
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-sm">Field Information</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div>Type: <span className="font-medium">{selectedField.type}</span></div>
                    <div>Required: <span className={`font-medium ${selectedField.required ? 'text-red-600' : 'text-gray-600'}`}>
                      {selectedField.required ? 'Yes' : 'No'}
                    </span></div>
                    {selectedField.maxLength && (
                      <div>Max Length: <span className="font-medium">{selectedField.maxLength}</span></div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Click Button Properties */}
          {selectedNode.type === 'click-button' && (
            <>
              <div>
                <Label htmlFor="buttonType">Button Type</Label>
                <Select value={formData.buttonType || ''} onValueChange={(value) => handleInputChange('buttonType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select button type" />
                  </SelectTrigger>
                  <SelectContent>
                    {buttonTypes.map(button => (
                      <SelectItem key={button.value} value={button.value}>
                        {button.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.buttonType === 'custom' && (
                <div>
                  <Label htmlFor="customButton">Custom Button Text</Label>
                  <Input
                    id="customButton"
                    value={formData.customButton || ''}
                    onChange={(e) => handleInputChange('customButton', e.target.value)}
                    placeholder="Enter button text or selector"
                  />
                </div>
              )}
            </>
          )}

          {/* Verify Field Properties */}
          {(selectedNode.type === 'verify-field' || selectedNode.type === 'verify-visibility') && (
            <>
              <div>
                <Label htmlFor="entity">Target Entity</Label>
                <Select value={formData.entity || ''} onValueChange={(value) => handleInputChange('entity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityOptions.map(entity => (
                      <SelectItem key={entity.value} value={entity.value}>
                        {entity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.entity && (
                <div>
                  <Label htmlFor="field">Field</Label>
                  <Select value={formData.field || ''} onValueChange={(value) => handleInputChange('field', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedNode.type === 'verify-field' && (
                <>
                  <div>
                    <Label htmlFor="operator">Operator</Label>
                    <Select value={formData.operator || ''} onValueChange={(value) => handleInputChange('operator', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map(op => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expected">Expected Value</Label>
                    <Input
                      id="expected"
                      value={formData.expected || ''}
                      onChange={(e) => handleInputChange('expected', e.target.value)}
                      placeholder="Enter expected value"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Condition Properties */}
          {selectedNode.type === 'condition' && (
            <>
              <div>
                <Label htmlFor="entity">Entity</Label>
                <Select value={formData.entity || ''} onValueChange={(value) => handleInputChange('entity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityOptions.map(entity => (
                      <SelectItem key={entity.value} value={entity.value}>
                        {entity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.entity && (
                <div>
                  <Label htmlFor="field">Field</Label>
                  <Select value={formData.field || ''} onValueChange={(value) => handleInputChange('field', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="operator">Operator</Label>
                <Select value={formData.operator || ''} onValueChange={(value) => handleInputChange('operator', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map(op => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">Comparison Value</Label>
                <Input
                  id="value"
                  value={formData.value || ''}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder="Enter comparison value"
                />
              </div>
            </>
          )}

          {/* Wait Properties */}
          {selectedNode.type === 'wait' && (
            <div>
              <Label htmlFor="delay">Delay (milliseconds)</Label>
              <Input
                id="delay"
                type="number"
                value={formData.delay || ''}
                onChange={(e) => handleInputChange('delay', e.target.value)}
                placeholder="Enter delay in milliseconds"
                min="0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="flex gap-3">
          <Button onClick={handleApplyChanges} className="flex-1">
            <Check className="h-4 w-4 mr-2" />
            Apply Changes
          </Button>
          <Button variant="outline" onClick={handleDeleteNode}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
