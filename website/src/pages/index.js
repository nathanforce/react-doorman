import React from 'react'
import { Doorman, Role } from 'react-doorman'

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
}

const user = {
  name: 'Nathan Force',
  access: 'ORG_ACCESS_ADMIN',
}

const App = () => (
  <div>
    <Doorman
      onLogin={user => {}}
      onLogout={user => {}}
      initialUser={user}
      roles={{
        ADMIN: user => user.access === 'ORG_ACCESS_ADMIN',
        STAFF: user => !user.access,
        JACK: user => user.name === 'jack',
      }}
    >
      {({ user, logout, login, isAdmin, isStaff, Admin, Staff, ...rest }) => (
        <div>
          <Admin>
            <div>Whaddup, Admin</div>
          </Admin>
          <Staff>Whaddup, Staff</Staff>

          {user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button
              onClick={() => {
                login({ access: false })
              }}
            >
              Login as Staff
            </button>
          )}
        </div>
      )}
    </Doorman>
  </div>
)

export default App
