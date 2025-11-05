import AppLayout from './components/layout/AppLayout';
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui';

function App() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Document Editor
          </h1>
          <p className="text-lg text-gray-600">
            Sprint 3 Complete: Design System & Core Components
          </p>
        </div>

        {/* Component Showcase */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Design System Components</CardTitle>
            <CardDescription>
              All core UI components are now built and ready to use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Buttons */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="lg">Large</Button>
                  <Button variant="primary" isLoading>Loading</Button>
                </div>
              </div>

              {/* Inputs */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Form Inputs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Document Title"
                    placeholder="Enter title..."
                    helperText="This will be the name of your document"
                  />
                  <Input
                    label="Author"
                    placeholder="Your name"
                    defaultValue="John Doe"
                  />
                  <div className="col-span-2">
                    <Textarea
                      label="Description"
                      placeholder="Add a description..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Card Variants</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card variant="default" padding="md">
                    <p className="text-sm text-gray-600">Default Card</p>
                  </Card>
                  <Card variant="bordered" padding="md">
                    <p className="text-sm text-gray-600">Bordered Card</p>
                  </Card>
                  <Card variant="elevated" padding="md">
                    <p className="text-sm text-gray-600">Elevated Card</p>
                  </Card>
                </div>
              </div>

              {/* Status */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Sprint 3 Status</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✅ Design tokens and constants</li>
                  <li>✅ Button component with variants</li>
                  <li>✅ Input and Textarea components</li>
                  <li>✅ Card component with sub-components</li>
                  <li>✅ Layout structure (Sidebar, Header, Canvas)</li>
                  <li>✅ Responsive and collapsible sidebar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps Card */}
        <Card>
          <CardHeader>
            <CardTitle>Next: Sprint 4</CardTitle>
            <CardDescription>Document Structure & State Management</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Define Document and Block TypeScript interfaces</li>
              <li>• Set up Zustand store for state management</li>
              <li>• Implement localStorage utilities</li>
              <li>• Create document list view</li>
              <li>• Build document CRUD operations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default App;
