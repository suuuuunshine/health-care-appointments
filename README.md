# Healthcare Appointment UI

A modern, responsive web application for booking healthcare appointments with doctors across various specialties. This application allows users to browse doctors, filter by specialty and availability, book appointments, and manage their scheduled appointments.

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/c8cead65-f6cd-45e1-9150-f29236634f6e" />

## Test the demo here: https://v0-healthcare-appointment-ui.vercel.app/

## Features

- Browse and filter doctors by specialty and availability
- View doctor details including ratings, location, and available time slots
- Book appointments with preferred doctors
- View and manage upcoming appointments
- Responsive design for desktop and mobile devices
- Persistent appointment storage using localStorage
- Prevention of double-booking the same time slot

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/healthcare-appointment-ui.git
   cd healthcare-appointment-ui

2. Install dependencies:
```shellscript
npm install
# or
yarn install
```


3. Start the development server:
```shellscript
npm run dev
# or
yarn dev
```


4. Open your browser and navigate to `http://localhost:3000`


### Running Tests
The project includes comprehensive unit tests for all components:
```shellscript
npm test
# or
yarn test
```

## How AI Tools Were Used

This project was developed with the assistance of AI tools in several ways:

1. **Initial UI Design**: AI was used to generate the initial UI components and layout structure, providing a foundation for the application's design.
2. **Component Structure**: AI helped determine the optimal component structure and separation of concerns, suggesting patterns for state management and data flow.
3. **Bug Fixing**: AI assisted in identifying and resolving bugs, particularly in the appointment booking logic to prevent double-booking issues.
4. **Test Generation**: AI was used to generate comprehensive unit tests for all components, ensuring good test coverage.
5. **Code Refactoring**: AI suggested improvements to the codebase, including performance optimizations and better handling of edge cases.


The development process was iterative, with AI providing suggestions that were then reviewed, modified, and integrated into the codebase. Human oversight was maintained throughout to ensure code quality and adherence to best practices.

## Known Limitations

- **Data Persistence**: Currently uses localStorage for data persistence, which means data is browser-specific and not shared across devices.
- **Authentication**: No user authentication system is implemented yet.
- **Doctor Data**: Uses mock data for doctors instead of fetching from a real API.
- **Limited Filtering**: Only supports filtering by specialty and availability, not by location, rating, or other criteria.
- **No Notifications**: No reminder or notification system for upcoming appointments.
- **Calendar Integration**: No integration with external calendar systems (Google Calendar, iCal, etc.).


## Next Steps

Future enhancements could include:

1. **Backend Integration**: Connect to a real backend API for doctor data and appointment management.
2. **User Authentication**: Implement a secure authentication system.
3. **Advanced Search**: Add more filtering options and search functionality.
4. **Appointment Reminders**: Add email or push notification reminders for upcoming appointments.
5. **Calendar Integration**: Allow users to add appointments to their preferred calendar.
6. **Doctor Reviews**: Enable patients to leave reviews for doctors after appointments.
7. **Telemedicine Support**: Add video consultation capabilities.
8. **Multi-language Support**: Implement internationalization for broader accessibility.
9. **Dark Mode**: Add theme support including a dark mode option.
10. **Accessibility Improvements**: Enhance accessibility features for users with disabilities.


## Project Structure

```plaintext
healthcare-appointment-ui/
├── app/                  # Next.js app directory
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Home page (doctor listing)
│   └── my-appointments/  # Appointments management page
├── components/           # Reusable UI components
│   ├── appointment-card.tsx
│   ├── booking-modal.tsx
│   ├── doctor-card.tsx
│   └── filter-bar.tsx
├── hooks/                # Custom React hooks
│   └── use-appointments.tsx
├── lib/                  # Utility functions and data
│   ├── data.ts           # Mock doctor data
│   └── types.ts          # TypeScript type definitions
└── __tests__/            # Test files
```

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library
- **date-fns**: Date utility library
- **Vitest**: Testing framework
- **React Testing Library**: Testing utilities for React component
