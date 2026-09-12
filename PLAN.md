# bot-nerd — Build Plan

> Source of truth for what to build. The template is **blank**: Docker, the database, the UI kit and
> an optional built-in auth (register/login/logout) are wired up, but **no feature exists yet** — the
> home page is a placeholder. Build everything below on top of it. Auth may stay as-is or be swapped
> for an external provider (see `CLAUDE.md` → Authentication, including its CORS rules). See
> `.claude/agents/` for specialist agents to delegate to, and `PROJECT_CONTEXT.md` for the file map.

## What it is
A structured learning platform where users discover, enroll in, and progress through courses on bot development, automation, and AI topics.

## User roles
- **Learner** — A registered user who browses, enrolls in, and completes courses to build bot and automation skills.
  - can: enroll in courses, watch lessons, take quizzes, track own progress, download certificates, post reviews, bookmark lessons
- **Instructor** — A creator who builds and publishes courses with modules, lessons, quizzes, and resources.
  - can: create and edit courses, add modules and lessons, upload videos and files, create quizzes, view enrollment analytics, publish or unpublish courses
- **Admin** — A platform administrator who manages all users, courses, and platform-wide content quality.
  - can: approve or reject courses, manage all users, assign instructor role, view platform analytics, delete any content, manage categories and tags

## Features
- Browse Course Catalog
- Course Detail Page
- Course Enrollment
- My Learning Dashboard
- Lesson Viewer
- Mark Lesson Complete
- Lesson Bookmarks
- Take Module Quiz
- Quiz Results & Feedback
- Quiz Retake
- Automatic Certificate Issuance
- Certificate Download
- Course Reviews & Ratings
- Create & Edit Course
- Module & Lesson Management
- Video & File Uploads
- Quiz Builder
- Submit Course for Review
- Instructor Analytics
- Course Pricing
- Stripe Checkout
- Payment Confirmation Webhook
- Purchase History
- Coupon / Discount Codes
- Course Approval Queue
- User Management
- Category & Tag Management
- Platform Analytics Dashboard
- Content Moderation

## Pages
### Catalog (`/catalog`)
Learners browse, search, and filter courses to find what they want to learn.
- Key actions: search by keyword, filter by category/tag/level, click course to view detail
- Data: Paginated list of published courses with thumbnail, title, instructor, rating, price, and level.

### CourseDetail (`/courses/:slug`)
Learners evaluate a course and decide to enroll.
- Key actions: watch promo video, view curriculum, read reviews, click enroll or buy
- Data: Course description, module/lesson list with durations, instructor bio, aggregated ratings, and individual reviews.

### LessonViewer (`/learn/:courseSlug/:lessonId`)
Enrolled learners consume lesson content and track their progress through the course.
- Key actions: watch/read lesson, mark lesson complete, navigate to next/previous lesson, bookmark lesson, download resources
- Data: Lesson video or text content, module/lesson sidebar with completion indicators, attached resources.

### QuizPage (`/learn/:courseSlug/quiz/:quizId`)
Learners test their module knowledge and receive scored feedback with explanations.
- Key actions: select answers, submit quiz, review results and explanations, retake quiz
- Data: Quiz questions and options during attempt; score, pass/fail status, and per-question feedback after submission.

### MyLearning (`/my-learning`)
Learners track and quickly resume all their active and completed courses.
- Key actions: resume course, view certificate, download certificate, view bookmarks
- Data: All enrollments with progress percentages, completion status, and a list of issued certificates.

### InstructorStudio (`/instructor`)
Instructors manage all their courses and monitor how learners are engaging with their content.
- Key actions: create new course, edit existing course, submit course for review, view analytics
- Data: All instructor-owned courses with status, enrollment count, average rating, and revenue.

### CourseEditor (`/instructor/courses/:id/edit`)
Instructors build out every detail of their course before submitting it for approval.
- Key actions: edit course details, add/reorder modules and lessons, upload video, build quiz, submit for review
- Data: Full editable course structure including all modules, lessons, resources, and quizzes.

### AdminPanel (`/admin`)
Admins maintain platform quality by reviewing courses, managing users, and monitoring growth.
- Key actions: approve or reject course, assign instructor role, create/delete category, deactivate user, view platform stats
- Data: Pending courses with instructor details, all user accounts, platform metrics (enrollments, revenue, signups).


## Data model
### categories
Top-level topic categories used to organize courses on the platform.
- `id`: uuid
- `name`: varchar
- `slug`: varchar
- `icon`: varchar
- `description`: text
- `created_at`: timestamp
- relationships: has many courses
### tags
Granular topic labels that can be applied to multiple courses for filtering.
- `id`: uuid
- `name`: varchar
- `slug`: varchar
- relationships: many-to-many with courses via course_tags
### courses
A complete learning course created by an instructor, containing modules and lessons.
- `id`: uuid
- `instructor_id`: uuid
- `category_id`: uuid
- `title`: varchar
- `slug`: varchar
- `description`: text
- `short_description`: varchar
- `thumbnail_url`: varchar
- `promo_video_url`: varchar
- `level`: varchar
- `language`: varchar
- `price`: numeric
- `is_free`: boolean
- `status`: varchar
- `avg_rating`: numeric
- `total_enrollments`: integer
- `published_at`: timestamp
- `created_at`: timestamp
- `updated_at`: timestamp
- relationships: belongs to users via instructor_id; belongs to categories via category_id; has many modules; has many enrollments; has many reviews; many-to-many with tags via course_tags
### course_tags
Join table linking courses to their associated tags.
- `course_id`: uuid
- `tag_id`: uuid
- relationships: belongs to courses; belongs to tags
### modules
A named section within a course grouping related lessons together.
- `id`: uuid
- `course_id`: uuid
- `title`: varchar
- `description`: text
- `position`: integer
- `created_at`: timestamp
- relationships: belongs to courses via course_id; has many lessons
### lessons
An individual learning unit (video, text, or resource) within a module.
- `id`: uuid
- `module_id`: uuid
- `title`: varchar
- `type`: varchar
- `content_url`: varchar
- `content_text`: text
- `duration_seconds`: integer
- `position`: integer
- `is_preview`: boolean
- `is_published`: boolean
- `created_at`: timestamp
- relationships: belongs to modules via module_id; has many lesson_completions; has many resources
### resources
Downloadable files or external links attached to a lesson.
- `id`: uuid
- `lesson_id`: uuid
- `title`: varchar
- `type`: varchar
- `url`: varchar
- `created_at`: timestamp
- relationships: belongs to lessons via lesson_id
### enrollments
Records a learner's enrollment in a course and tracks their overall progress.
- `id`: uuid
- `user_id`: uuid
- `course_id`: uuid
- `progress_percent`: numeric
- `is_completed`: boolean
- `completed_at`: timestamp
- `enrolled_at`: timestamp
- `last_accessed_at`: timestamp
- relationships: belongs to users via user_id; belongs to courses via course_id; has many lesson_completions
### lesson_completions
Tracks which lessons a learner has marked as complete within an enrollment.
- `id`: uuid
- `enrollment_id`: uuid
- `lesson_id`: uuid
- `completed_at`: timestamp
- relationships: belongs to enrollments via enrollment_id; belongs to lessons via lesson_id
### quizzes
A knowledge-check assessment attached to a course module.
- `id`: uuid
- `module_id`: uuid
- `title`: varchar
- `pass_score`: integer
- `created_at`: timestamp
- relationships: belongs to modules via module_id; has many quiz_questions; has many quiz_attempts
### quiz_questions
Individual multiple-choice or true/false questions within a quiz.
- `id`: uuid
- `quiz_id`: uuid
- `question_text`: text
- `options`: jsonb
- `correct_option`: varchar
- `explanation`: text
- `position`: integer
- relationships: belongs to quizzes via quiz_id
### quiz_attempts
Records each learner's attempt at a quiz, including answers and score.
- `id`: uuid
- `quiz_id`: uuid
- `user_id`: uuid
- `answers`: jsonb
- `score`: integer
- `passed`: boolean
- `attempt_number`: integer
- `attempted_at`: timestamp
- relationships: belongs to quizzes via quiz_id; belongs to users via user_id
### reviews
A learner's star rating and written review for an enrolled course.
- `id`: uuid
- `user_id`: uuid
- `course_id`: uuid
- `rating`: integer
- `body`: text
- `created_at`: timestamp
- `updated_at`: timestamp
- relationships: belongs to users via user_id; belongs to courses via course_id
### certificates
A completion certificate issued to a learner once all course requirements are met.
- `id`: uuid
- `user_id`: uuid
- `course_id`: uuid
- `certificate_number`: varchar
- `issued_at`: timestamp
- relationships: belongs to users via user_id; belongs to courses via course_id
### bookmarks
A learner's saved/bookmarked lessons for quick later reference.
- `id`: uuid
- `user_id`: uuid
- `lesson_id`: uuid
- `created_at`: timestamp
- relationships: belongs to users via user_id; belongs to lessons via lesson_id

## API surface (app-specific)
- `GET /api/courses` — List all published courses with optional filters for category, tag, level, price, and search query.
- `POST /api/courses` — Create a new draft course (Instructor only).
- `GET /api/courses/{slug}` — Get full details of a single course including modules, lessons preview, reviews, and instructor info.
- `PUT /api/courses/{id}` — Update course metadata, thumbnail, or status (Instructor/Admin).
- `POST /api/courses/{id}/enroll` — Enroll the authenticated learner in a course (free) or confirm payment then enroll.
- `GET /api/courses/{id}/progress` — Get the authenticated learner's progress, completed lessons, and quiz scores for a course.
- `POST /api/lessons/{id}/complete` — Mark a lesson as complete for the authenticated learner and recalculate enrollment progress.
- `GET /api/modules/{module_id}/quizzes/{quiz_id}` — Fetch quiz questions for a specific quiz (enrolled learners only).
- `POST /api/quizzes/{quiz_id}/attempt` — Submit a quiz attempt, grade it, and return the score and correct answers.
- `POST /api/courses/{id}/reviews` — Submit a review and rating for a completed course; one review per user per course.
- `GET /api/my/enrollments` — List all courses the authenticated learner is enrolled in with progress data.
- `GET /api/my/certificates` — List all certificates earned by the authenticated learner.

## Business rules & validation
- A learner must enroll in a course before accessing any of its lessons or quizzes.
- Lessons within a module must be completed in order before the next lesson unlocks.
- A quiz can be retaken up to 3 times; the highest score is recorded.
- A certificate is only issued when a learner achieves at least 80% quiz average across the course and marks all lessons as complete.
- A course must have at least one module with at least one published lesson before it can be published.
- An instructor cannot edit a course's content after it has active enrollments without creating a new draft version.
- A course must be approved by an Admin before it becomes publicly visible to learners.
- A learner can only post one review per course, and only after completing at least 50% of the course.
- Free courses are accessible upon enrollment; paid courses require payment confirmation before content unlocks.
- A learner's progress percentage is calculated as completed lessons divided by total published lessons in the course.
- Tags and categories must exist in the platform taxonomy before being assigned to a course.
- Instructors can view aggregated analytics but cannot see individual learner personal information.

## Working style
- Read this file and `PROJECT_CONTEXT.md` first; don't re-ask the user things answered here.
- Delegate focused work to the agents in `.claude/agents/` (frontend, backend API, DB schema, QA).
- Only ask the user when a decision is genuinely ambiguous and not covered above.
