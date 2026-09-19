# HOMESeva Commerce Platform

Welcome to the HOMESeva Commerce Platform! This project is designed to provide a mobile-first omnichannel commerce application for web, Android, and iOS. 

## Project Structure

The project is organized into several applications and packages:

- **apps/**: Contains the main applications for customers, admin, and Firebase functions.
  - **customer/**: The customer-facing application.
  - **admin/**: The admin portal for managing the platform.
  - **functions/**: Firebase functions for backend operations.

- **packages/**: Contains shared packages for domain logic, Firebase utilities, UI components, configuration, internationalization, and testing.
  - **domain/**: Business logic and domain models.
  - **firebase/**: Firebase-related utilities.
  - **ui/**: Reusable UI components.
  - **config/**: Configuration settings.
  - **i18n/**: Internationalization and localization utilities.
  - **testing/**: Testing utilities and helpers.

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd HOMESeva-Commerce-Platform
   ```

2. **Install dependencies**:
   ```
   pnpm install
   ```

3. **Run the applications**:
   - For the customer application:
     ```
     cd apps/customer
     pnpm start
     ```
   - For the admin application:
     ```
     cd apps/admin
     pnpm start
     ```

4. **Deploy Firebase functions**:
   ```
   cd apps/functions
   pnpm deploy
   ```

## Features

- **Customer Application**: Browse and book services, purchase products, manage orders, and view invoices.
- **Admin Portal**: Manage catalog, inventory, orders, users, and view analytics.
- **Firebase Functions**: Handle backend operations, including payment processing and notifications.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.