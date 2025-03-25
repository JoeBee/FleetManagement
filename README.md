This is a modern Angular application built using the latest best practices and patterns for Angular operations.


## Technical Stack

- **Framework**: Angular (Latest Version)
- **UI Components**: Angular Material Design
- **State Management**: Angular Signals
- **Form Handling**: Angular Reactive Forms
- **Architecture**: Standalone Components


## Project Structure
src/
├── app/
│ ├── components/ # Standalone components
│ ├── services/ # Application services
│ ├── models/ # TypeScript interfaces/types
│ ├── utils/ # Utility functions
│ └── shared/ # Shared components/modules
├── assets/ # Static assets
└── styles/ # Global styles
## Development Guidelines


### Component Structure
Each component follows a three-file structure:
- `component-name.component.ts` - Component logic
- `component-name.component.html` - Template
- `component-name.component.scss` - Component-specific styles


### Component Example
```typescript
@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent {
  // Component implementation
}
```


### State Management
The application uses Angular Signals for reactive state management:

```typescript
export class VehicleService {
  private vehicles = signal<Vehicle[]>([]);
  
  getVehicles() {
    return this.vehicles.asReadonly();
  }
}
```


### Forms
Reactive forms are used, where possible, throughout the application:

```typescript
export class VehicleFormComponent {
  vehicleForm = new FormGroup({
    id: new FormControl(''),
    make: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required)
  });
}
```

## Getting Started

1. **Prerequisites**
   - Node.js (LTS version)
   - npm or yarn
   - Angular CLI

2. **Installation**
   ```bash
   npm install
   ```

3. **Development Server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`

4. **Building for Production**
   ```bash
   ng build --configuration production
   ```


## Testing

- Unit Tests: `ng test`
- E2E Tests: `ng e2e`


## Code Style and Best Practices

1. **Component Organization**
   - Use standalone components
   - Follow single responsibility principle
   - Implement proper component lifecycle management

2. **State Management**
   - Utilize Angular Signals for reactive state
   - Keep state mutations predictable
   - Implement proper error handling

3. **Form Handling**
   - Use reactive forms for complex form scenarios
   - Implement proper validation
   - Handle form submissions asynchronously

4. **Material Design**
   - Utilize Material Design components consistently
   - Follow Material Design guidelines for spacing and typography
   - Maintain consistent theming


## Contributing

1. Follow the established component structure
2. Ensure all components are standalone
3. Use Material Design components
4. Implement reactive forms where applicable
5. Utilize Angular Signals for state management
6. Write unit tests for new features


## Build and Deployment

The application can be built using the Angular CLI:

```bash
ng build --configuration production
```

The built artifacts will be stored in the `dist/` directory.


## Data Storage

The application implements a multi-layered data storage strategy:

### Data Types
The application uses several TypeScript interfaces for data modeling:

```typescript
interface DataTabRowObj {
    rowNumber: number;
    imo: string;
    fleet: string;
    result: string;
    urlEndPoint: string;
}

interface FleetImoLookupObj {
    fleetNum: string;
    imo: string;
}

interface FleetIDSettingsObj {
    fleetNum: string;
    fleetId: string;
}

interface imoFleetObj {
    imo: string;
    CALCULATED_fleetNum: string;
}
```

### Storage Mechanisms

1. **Browser Storage**
   - **LocalStorage**: Used for storing application settings
     - API Key
     - Fleet IDs configuration
   - **IndexedDB**: Used for storing larger datasets
     - Fleet/IMO lookup data
     - Database name: 'FleetManagementDB'
     - Store name: 'fleetLookupData'

2. **In-Memory Storage**
   - Angular Signals for reactive state management
   - Service-level state management using class properties
   - Temporary data processing and caching

3. **External API Integration**
   - Marine Traffic API integration
   - Base URL: "https://services.marinetraffic.com/api/setfleet/"
   - Endpoint structure: `/${apiKey}/imo:${imo}/${action}/fleet_id:${fleetId}`

### Data Persistence Service
The application includes a dedicated `DataPersistenceService` that handles:
- Data initialization on application startup
- Synchronization between different storage mechanisms
- Fallback mechanisms for storage failures
- Data migration and versioning

### State Management
- Angular Signals for reactive state updates
- Event emitters for component communication
- Service-based state management for application-wide data

### Storage Key Naming Conventions
Storage keys should follow these conventions:

1. **Format**: Use kebab-case with namespacing
   ```typescript
   // Example format
   readonly STORAGE_KEY = '@app-name/feature-name';
   ```

2. **Prefixing**: Include descriptive prefix for key type
   ```typescript
   // Example with prefix
   readonly STORAGE_KEY_API = '@fleet-mgmt/api-key';
   ```

3. **Namespacing**: Use @ prefix and forward slash for namespacing
   ```typescript
   // Example namespacing
   readonly STORAGE_KEY_API = '@fleet-mgmt/api-key';
   readonly STORAGE_KEY_FLEET_IDS = '@fleet-mgmt/fleet-ids';
   ```

Current implementation follows these conventions:
```typescript
readonly STORAGE_KEY_API = '@fleet-mgmt/api-key';
readonly STORAGE_KEY_FLEET_IDS = '@fleet-mgmt/fleet-ids';
readonly STORAGE_KEY_FLEET_IMO_LOOKUP = '@fleet-mgmt/fleet-imo-lookup';
```

### Application Initialization
The `AppInitializerService` is a crucial service that handles the application's startup sequence:

1. **Purpose**
   - Ensures all necessary data is loaded before the application becomes operational
   - Manages the initialization of application state from persistent storage
   - Provides a reliable startup sequence for the application

2. **Initialization Process**
   - Loads API key from localStorage
   - Retrieves fleet IDs configuration
   - Loads fleet/IMO lookup data from IndexedDB
   - Handles initialization errors gracefully
   - Ensures the application can start even if some data loading fails

3. **Error Handling**
   - Implements robust error handling for each initialization step
   - Logs errors for debugging purposes
   - Allows the application to start even if some data is unavailable

4. **Integration**
   - Works in conjunction with `DataService` and `DataPersistenceService`
   - Ensures data consistency across different storage mechanisms
   - Provides a single point of control for application initialization

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Angular Signals Guide](https://angular.io/guide/signals)


