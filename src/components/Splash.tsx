import * as React from "react";

import { useSdk } from "../service";
import { Loading, PageLayout } from "../theme";
import ErrorLogic from "./ErrorLogic";

// Splash is a container to either show a loading (splash) page, or render the app
// with a given PageLayout
function Splash(props: { readonly children: any }): JSX.Element {
  const { loading } = useSdk();

  if (loading) {
    return (
      <React.Fragment>
        <Loading />
        <ErrorLogic />
      </React.Fragment>
    );
  } else {
    return <PageLayout>{props.children}</PageLayout>;
  }
}

export default Splash;
