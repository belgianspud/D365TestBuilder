# D365 Test Automation Tool

A cloud-based visual test automation tool for Microsoft Dynamics 365 with drag-and-drop workflow design and mock D365 integration.

## Features

### Visual Flow Designer
- **Drag-and-Drop Interface**: Intuitive component palette with test steps
- **Visual Connections**: Connect test steps with arrows to build workflows
- **Connection Management**: Delete connections and nodes with keyboard shortcuts
- **Real-time Preview**: See your test flow as you build it

### D365 Integration
- **Entity Support**: Account, Contact, and Opportunity entities
- **Field Types**: Text, lookup, optionset, currency, datetime, boolean, memo
- **Smart Input Controls**: Dynamic dropdowns for lookup values and optionsets
- **Field Validation**: Real-time field information and requirements

### Test Components
- **Navigate to Record**: Open specific records or create new ones
- **Set Field Value**: Update form fields with specific values
- **Click Button**: Interact with Save, Delete, or custom buttons
- **Verify Field Contains**: Assert field values match expectations
- **Verify Visibility**: Check if elements are visible or hidden
- **Conditional Branch**: If/then logic based on field values
- **Wait/Delay**: Pause execution for specified time

### Test Execution
- **Mock Execution**: Simulate test runs with realistic results
- **Detailed Results**: Step-by-step execution status and timing
- **Visual Feedback**: Progress indicators and success/failure states

## Tech Stack

### Frontend
- **React** with TypeScript
- **React Flow** for visual workflow designer
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **TanStack Query** for data fetching
- **Wouter** for routing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **In-memory storage** for rapid prototyping
- **Zod** for schema validation

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd d365-test-automation
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Usage

### Building Test Flows

1. **Add Components**: Drag test components from the left panel to the canvas
2. **Connect Steps**: Drag from the output handle of one node to the input handle of another
3. **Configure Properties**: Select a node to configure its properties in the right panel
4. **Save & Run**: Save your test case and run it to see results

### Managing Connections

- **Create**: Drag between node handles to create connections
- **Delete**: Click a connection and press Delete/Backspace
- **Multi-select**: Hold Ctrl/Cmd to select multiple items

### D365 Field Configuration

1. Select an entity (Account, Contact, Opportunity)
2. Choose a field from the dropdown
3. Configure field-specific options:
   - **Text fields**: Enter any text value
   - **Lookup fields**: Select from available records
   - **Optionset fields**: Choose from predefined options

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility functions and types
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite development setup
├── shared/                 # Shared types and schemas
└── components.json         # Shadcn/ui configuration
```

## API Endpoints

- `GET /api/test-cases` - Retrieve all test cases
- `GET /api/test-cases/:id` - Get specific test case
- `POST /api/test-cases` - Create new test case
- `PUT /api/test-cases/:id` - Update test case
- `DELETE /api/test-cases/:id` - Delete test case
- `POST /api/test-cases/:id/run` - Execute test case

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Adding New Components

1. Define the component type in `shared/schema.ts`
2. Add the component to `client/src/lib/flow-types.ts`
3. Update the component palette in `client/src/components/component-palette.tsx`
4. Add property configuration in `client/src/components/properties-panel.tsx`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React Flow for the visual workflow designer
- UI components from Shadcn/ui
- Icons from Lucide React
- Microsoft Design System color palette