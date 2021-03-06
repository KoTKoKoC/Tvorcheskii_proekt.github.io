import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { MainPage } from "./layouts/pages/MainPage";
import { SchedulePage } from "./layouts/pages/SchedulePage";
import { TasksPage } from "./layouts/pages/TasksPage";
import { MoneyPage } from "./layouts/pages/MoneyPage";
import { ProfilePage } from "./layouts/pages/ProfilePage";
import { LoginPage } from "./layouts/pages/auth/LoginPage";
import { RegisterPage } from "./layouts/pages/auth/RegisterPage";
import { TaskPage } from "./layouts/pages/subPages/TaskPage";
import { EditTaskPage } from "./layouts/pages/subPages/EditTaskPage";
import { EditProfilePage } from "./layouts/pages/EditProfilePage";

export const RotesPage = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return (
      <div>
        <Switch>
          <Route path="/" exact>
            <MainPage />
          </Route>
          <Route path="/schedule" exact>
            <SchedulePage />
          </Route>
          <Route path="/tasks" exact>
            <TasksPage />
          </Route>
          <Route path="/money" exact>
            <MoneyPage />
          </Route>
          <Route path="/profile" exact>
            <ProfilePage />
          </Route>
          <Route path="/task/:id">
            <TaskPage/>
          </Route>
          <Route path="/edit/:id">
            <EditTaskPage/>
          </Route>
          <Route path="/profile/edit">
            <EditProfilePage/>
          </Route>
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/register" exact>
          <RegisterPage />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }

  // if (isAuthenticated === null) {
  //   return null;
  // }
};
