const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userid: state => state.user.userid,
  name: state => state.user.name,
  roles: state => state.user.roles,
  logins: state => state.user.logins,
  session: state => state.user.session,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
