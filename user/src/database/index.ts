
export = {
    databaseConnection: require('./connection').default,
    AdminRepository: require('./repository/admin').default,
    RoleRepository: require('./repository/role').default,
};

