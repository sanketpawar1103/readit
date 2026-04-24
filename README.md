# Phase 1

# Readit

Your goal is to make a Reddit clone called Readit. If you don't know reddit, go
check it out.

For the first version, we will make a frontend only app that allows a user to
create a post, read a post and delete a post.

## Create

When you make a post(title + content) and click on Post, it should appear below
in your feed. The most recent post should be at the top.

## Delete

Delete should only happen with a confirmation.

# Conditions

- Frontend only
- Start simple, eventually add a reducer
- Keep the UI simple
- Do not use Tailwind or Material UI to start with.
- We can beautify it later
- Assume a default user name for now.
- Consider using the `date-fns` library for the dates and time stamps

# Phase 2

# Backend

Add a backend and have all the interactions update the backend before updating
frontend state.

Upon first render, a fetch has to happen to get the initial state of the system
and render it.

# Things to consider

- Cors vs Proxy
- Where will you put the effect?
- If you are using reducers, will the update on the frontend happen before or
  after the call?

# Phase 3

# Persistence

We will now add a persistence layer in the backend.

For our database, we will choose MongoDB. You will have to research and find out
how to use MongoDB, how to use MongoDB in Javascript, then use MongoDB in
Javascript.

The best suggestion is to first build a persistence layer independent of
MongoDB. Inject that as a dependency, then implement the MongoDB version of the
persistence layer interface.

Best of luck.

# Phase 4

# Auth

Add a login mechanism. A user should only be able to see their posts, create
posts and generally perform other operations upon login.

Have the authentication be basic as of now. Just a username and a password.

Signup and login are the same at this point.

# Things to think about

- How does the backend change?
- How does the frontend change?
- What is the flow?
- Are you still a single page app? If not, how will it work?
- Maybe contexts get useful now?

# Phase 5

# Search and subscribe

Have a search option that allows the user to search for other users. Upon
clicking search, a list of matching users show up with the option to subscribe
to that user's posts. Upon clicking subscribe(or unsubscribe), the feed has to
reflect the latest subscription(unsubscription). Subscription should show the
subscribed user's posts and unsubscribe should remove those.

The delete option should only show up on the user's own posts.

# Phase 6

# Likes

- Each post can be liked.
- Each post also shows how many likes it has received.
- A liked post can be unliked
- Your own post can be liked
- You can't like a post multiple times.
