# Components

Components include the app-specific React Elements that are used to build our specific application.
They make use of the functionality in `service` to handle the blockchain connection, and use the
elements in `theme` to provide visual design.

There are two major classes here - passive "components", and active "containers". We try to keep each
Element in one of these two classes. The "components" take props and control a layout of multiple elements,
often pulling in design from `theme`. They may contain some minimal local state, but that should be related
to the user interaction (eg. contents of a form field, value of a selector, etc).

"Containers" provide a bridge to services and more "global" state, passing in the context to components
as props, which control their rendering. This allows use to easily storyboard out "components" without needing
a backend, which providing isolated containers which can be tested that just control connection of backend state to props.

We try to make exclusive use of functional components and the "new" React hooks APIs.
