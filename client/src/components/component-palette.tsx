import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  Edit, 
  MousePointer, 
  CheckCircle, 
  Eye, 
  GitBranch, 
  Clock
} from "lucide-react";

interface ComponentType {
  id: string;
  type: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: string;
}

const components: ComponentType[] = [
  {
    id: 'navigate-record',
    type: 'navigate-record',
    label: 'Navigate to Record',
    description: 'Open a specific record or create new',
    icon: ArrowRight,
    color: 'text-blue-600',
    category: 'Entity Actions'
  },
  {
    id: 'set-field',
    type: 'set-field',
    label: 'Set Field Value',
    description: 'Update form field with specific value',
    icon: Edit,
    color: 'text-green-600',
    category: 'Entity Actions'
  },
  {
    id: 'click-button',
    type: 'click-button',
    label: 'Click Button',
    description: 'Click Save, Delete, or custom buttons',
    icon: MousePointer,
    color: 'text-orange-600',
    category: 'Entity Actions'
  },
  {
    id: 'verify-field',
    type: 'verify-field',
    label: 'Verify Field Contains',
    description: 'Assert field has expected value',
    icon: CheckCircle,
    color: 'text-green-600',
    category: 'Validation'
  },
  {
    id: 'verify-visibility',
    type: 'verify-visibility',
    label: 'Verify Visibility',
    description: 'Check if element is visible/hidden',
    icon: Eye,
    color: 'text-blue-600',
    category: 'Validation'
  },
  {
    id: 'condition',
    type: 'condition',
    label: 'Conditional Branch',
    description: 'If/then logic based on field values',
    icon: GitBranch,
    color: 'text-orange-600',
    category: 'Flow Control'
  },
  {
    id: 'wait',
    type: 'wait',
    label: 'Wait/Delay',
    description: 'Pause execution for specified time',
    icon: Clock,
    color: 'text-gray-600',
    category: 'Flow Control'
  }
];

const categories = ['Entity Actions', 'Validation', 'Flow Control'];

export default function ComponentPalette() {
  const handleDragStart = (event: React.DragEvent, componentType: string) => {
    event.dataTransfer.setData('application/reactflow', componentType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600">Drag components to the canvas to build your test flow</p>
      </div>
      
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-900 mb-3">{category}</h3>
            <div className="space-y-2">
              {components
                .filter(component => component.category === category)
                .map((component) => {
                  const IconComponent = component.icon;
                  return (
                    <Card
                      key={component.id}
                      className="p-3 cursor-move hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 border-gray-200"
                      draggable
                      onDragStart={(e) => handleDragStart(e, component.type)}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-5 w-5 ${component.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {component.label}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-2">
                            {component.description}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
            {category !== categories[categories.length - 1] && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
