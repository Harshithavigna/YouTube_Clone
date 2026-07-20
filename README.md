\# YouTube Clone (MERN Stack)



A full-stack YouTube clone built with MongoDB, Express, React (Vite), and Node.js.



\## Features

\- \*\*Home page\*\*: header, toggleable sidebar, category filter buttons, responsive video grid

\- \*\*Auth\*\*: register + login with JWT, server-side validation, protected routes

\- \*\*Search\*\*: search bar in header filters videos by title

\- \*\*Filters\*\*: 8 category buttons filter videos by category

\- \*\*Video player page\*\*: plays video, shows description, like/dislike, full comment CRUD

\- \*\*Channel page\*\*: create a channel, upload/edit/delete videos (full CRUD), banner + subscriber count

\- \*\*Responsive design\*\*: works on mobile, tablet, and desktop



\## Project Structure
youtube-clone/

backend/ Express + MongoDB API (ES Modules)

config/db.js

models/ User, Channel, Video (comments embedded in Video)

middleware/auth.js

controllers/

routes/

seed/seed.js

server.js

frontend/ React app (Vite)

src/

api/axios.js

context/AuthContext.jsx

components/ Header, Sidebar, FilterButtons, VideoCard

pages/ Home, Auth, VideoPlayer, Channel, CreateChannel

App.jsx, main.jsx, index.css

#### Setup



\### 1. Backend
cd backend

npm install



create a .env file with:

PORT=5000

MONGO\_URI=<your MongoDB Atlas connection string>

JWT\_SECRET=<any random string>

JWT\_EXPIRES\_IN=7d

CLIENT\_URL=http://localhost:5173
npm run seed # optional: loads sample users/videos

npm run dev # starts on http://localhost:5000
Sample login after seeding: `john@example.com` / `password123`



\### 2. Frontend
cd frontend

npm install

npm run dev # starts on http://localhost:5173
## API Overview



| Method | Endpoint | Auth | Description |

|---|---|---|---|

| POST | /api/auth/register | - | Register a new user |

| POST | /api/auth/login | - | Log in, returns JWT |

| GET  | /api/auth/me | Yes | Get current user |

| POST | /api/channels | Yes | Create a channel |

| GET  | /api/channels/:id | - | Get channel + its videos |

| PUT/DELETE | /api/channels/:id | Yes (owner) | Edit/delete channel |

| GET | /api/videos?search=\&category= | - | List/search/filter videos |

| GET | /api/videos/:id | - | Get one video (increments views) |

| POST | /api/videos | Yes (channel owner) | Upload a video |

| PUT/DELETE | /api/videos/:id | Yes (uploader) | Edit/delete a video |

| PATCH | /api/videos/:id/like | Yes | Toggle like |

| PATCH | /api/videos/:id/dislike | Yes | Toggle dislike |

| POST | /api/videos/:id/comments | Yes | Add a comment |

| PUT/DELETE | /api/videos/:videoId/comments/:commentId | Yes (author) | Edit/delete a comment |



\## Design Notes

\- ES Modules used throughout (no CommonJS `require`)

\- Vite used instead of the deprecated Create React App

\- Comments are embedded inside each Video document rather than a separate collection, since nested replies were out of scope

\- Sign-in flow uses a real JWT-authenticated `/auth` page rather than an embedded Google Form, since a Google Form cannot issue tokens or hash passwords — this preserves the required behavior (separate sign-in page, redirect, username shown after login) while keeping authentication fully functional

