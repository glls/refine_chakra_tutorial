import React from "react";

import { Refine } from "@pankod/refine-core";
import {
  notificationProvider,
  ChakraProvider,
  refineTheme,
  ReadyPage,
  ErrorComponent,
  Layout,
} from "@pankod/refine-chakra-ui";

import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";

import { PostList, PostCreate, PostEdit, PostShow } from "./pages";

const App = () => {
  return (
    <ChakraProvider theme={refineTheme}>
      <Refine
        notificationProvider={notificationProvider()}
        ReadyPage={ReadyPage}        
        Layout={Layout}
        routerProvider={routerProvider}
        dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
        catchAll={<ErrorComponent />}
        resources={[
          {
            name: "posts",
            list: PostList,
            show: PostShow,
            edit: PostEdit,
            create: PostCreate,
            canDelete: true,
          },
        ]}
      />
    </ChakraProvider>
  );
};

export default App;
