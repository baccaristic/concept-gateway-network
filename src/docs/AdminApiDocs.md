
# Admin API Documentation for Spring Boot Backend

This document outlines the necessary API endpoints that need to be implemented in the Spring Boot backend to support the admin dashboard functionality.

## Authentication and Authorization

All admin endpoints should be secured with JWT authentication and restricted to users with the `ADMIN` role.

## API Endpoints

### User Management

#### 1. Get All Users
- **URL**: `/admin/users`
- **Method**: `GET`
- **Description**: Retrieves all users in the system
- **Response**: Array of User objects
- **Authentication**: Required (Admin only)

#### 2. Update User Role
- **URL**: `/admin/users/{userId}/role`
- **Method**: `PUT`
- **Description**: Updates a user's role
- **Request Body**:
  ```json
  { "role": "ADMIN" }  // Valid roles: "ADMIN", "EXPERT", "INVESTOR", "IDEA_HOLDER"
  ```
- **Response**: Updated User object
- **Authentication**: Required (Admin only)

#### 3. Add Expert
- **URL**: `/admin/experts`
- **Method**: `POST`
- **Description**: Creates a new user with the EXPERT role
- **Request Body**:
  ```json
  { 
    "name": "Expert Name",
    "email": "expert@example.com",
    "password": "securePassword"
  }
  ```
- **Response**: Created User object
- **Authentication**: Required (Admin only)

### Idea Management

#### 1. Get All Ideas
- **URL**: `/admin/ideas`
- **Method**: `GET`
- **Description**: Retrieves all ideas in the system
- **Response**: Array of Idea objects
- **Authentication**: Required (Admin only)

#### 2. Get Idea by ID
- **URL**: `/admin/ideas/{ideaId}`
- **Method**: `GET`
- **Description**: Retrieves a specific idea by ID
- **Response**: Idea object
- **Authentication**: Required (Admin only)

#### 3. Update Idea Status
- **URL**: `/admin/ideas/{ideaId}/status`
- **Method**: `PUT`
- **Description**: Updates an idea's status
- **Request Body**:
  ```json
  { "status": "APPROVED" }  // Valid statuses: "AWAITING_APPROVAL", "APPROVED", "ESTIMATED", "CONFIRMED"
  ```
- **Response**: Updated Idea object
- **Authentication**: Required (Admin only)

#### 4. Delete Idea
- **URL**: `/admin/ideas/{ideaId}`
- **Method**: `DELETE`
- **Description**: Deletes an idea
- **Response**: 204 No Content
- **Authentication**: Required (Admin only)

### Dashboard Statistics

#### 1. Get Dashboard Stats
- **URL**: `/admin/dashboard/stats`
- **Method**: `GET`
- **Description**: Retrieves summary statistics for the admin dashboard
- **Response**:
  ```json
  {
    "userCount": 100,
    "ideaCount": 50,
    "expertCount": 10,
    "investorCount": 20,
    "ideaHolderCount": 65,
    "adminCount": 5,
    "statusCounts": {
      "AWAITING_APPROVAL": 10,
      "APPROVED": 20,
      "ESTIMATED": 15,
      "CONFIRMED": 5
    }
  }
  ```
- **Authentication**: Required (Admin only)

## Implementation Notes

1. All endpoints should return appropriate HTTP status codes:
   - 200 OK for successful operations
   - 201 Created when a new resource is created
   - 204 No Content for successful deletions
   - 400 Bad Request for invalid input
   - 403 Forbidden for unauthorized access
   - 404 Not Found for non-existent resources
   - 500 Internal Server Error for server issues

2. Add proper validation for all request payloads

3. Implement proper error handling and return descriptive error messages

4. Use appropriate pagination for endpoints that return potentially large collections

5. Consider adding filtering capabilities to the endpoints that return collections

## Spring Boot Controller Example

```java
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private IdeaService ideaService;
    
    @Autowired
    private StatsService statsService;
    
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }
    
    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUserRole(@PathVariable String userId, @RequestBody RoleUpdateRequest request) {
        User updatedUser = userService.updateUserRole(userId, request.getRole());
        return ResponseEntity.ok(updatedUser);
    }
    
    @PostMapping("/experts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> addExpert(@RequestBody ExpertCreationRequest request) {
        User expert = userService.createExpert(request.getName(), request.getEmail(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).body(expert);
    }
    
    // Additional endpoints for ideas and stats...
}
```
