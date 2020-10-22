# Routes

This uses react router to handle routing of multiple paths to different pages. This should be minimal and any
components defined here just pull out path parameters and render a component (or container) with the path
information as props. No logic or layout should be present here.

Note that we use `HashRouter`, as we wish to host with gh-pages and cannot control the redirects when users reload
from a non root path. We will stick with this for now until there is a good solution that also works with the demo deploy.