export const STANDARD = {
  CONFIGURATION: {
    // MENU
    MENU: {
      VIEW: 'menuPermission.standard.configuration.menu.view',
      CREATE: 'menuPermission.standard.configuration.menu.create',
      MODIFY: 'menuPermission.standard.configuration.menu.modify',
      DELETE: 'menuPermission.standard.configuration.menu.delete',
      SET_PERMISSION: 'menuPermission.standard.configuration.menu.set_permission',
    },

    // COMMON_DETAIL
    COMMON_DETAIL: {
      VIEW: 'menuPermission.standard.configuration.common.commondetail.view',
      CREATE: 'menuPermission.standard.configuration.common.commondetail.create',
      MODIFY: 'menuPermission.standard.configuration.common.commondetail.modify',
      DELETE: 'menuPermission.standard.configuration.common.commondetail.delete',
    },

    // COMMON_MASTER
    COMMON_MASTER: {
      VIEW: 'menuPermission.standard.configuration.common.commonmaster.view',
      CREATE: 'menuPermission.standard.configuration.common.commonmaster.create',
      MODIFY: 'menuPermission.standard.configuration.common.commonmaster.modify',
      DELETE: 'menuPermission.standard.configuration.common.commonmaster.delete',
    },

    // USER
    USER: {
      VIEW: 'menuPermission.standard.configuration.user.view',
      CREATE: 'menuPermission.standard.configuration.user.create',
      MODIFY: 'menuPermission.standard.configuration.user.modify',
      DELETE: 'menuPermission.standard.configuration.user.delete',
      CHANGE_PASS: 'menuPermission.standard.configuration.user.change_pass',
    },

    // ROLE
    ROLE: {
      VIEW: 'menuPermission.standard.configuration.role.view',
      CREATE: 'menuPermission.standard.configuration.role.create',
      MODIFY: 'menuPermission.standard.configuration.role.modify',
      DELETE: 'menuPermission.standard.configuration.role.delete',
      SET_MENU: 'menuPermission.standard.configuration.role.set_menu',
      SET_PERMISSION: 'menuPermission.standard.configuration.role.set_permission',
    },

    // DOCUMENT
    DOCUMENT: {
      VIEW: 'menuPermission.standard.configuration.document.view',
      CREATE: 'menuPermission.standard.configuration.document.create',
      MODIFY: 'menuPermission.standard.configuration.document.modify',
      DELETE: 'menuPermission.standard.configuration.document.delete',
    },
  },
  INFORMATION: {
    // Q2_POLICY
    Q2_POLICY: {
      VIEW: 'menuPermission.standard.information.q2policy.view',
      CREATE: 'menuPermission.standard.information.q2policy.create',
      MODIFY: 'menuPermission.standard.information.q2policy.modify',
      DELETE: 'menuPermission.standard.information.q2policy.delete',
    },

    // MACHINE
    MACHINE: {
      VIEW: 'menuPermission.standard.information.machine.view',
      CREATE: 'menuPermission.standard.information.machine.create',
      MODIFY: 'menuPermission.standard.information.machine.modify',
      DELETE: 'menuPermission.standard.information.machine.delete',
    },
  },
};

export const EDI = {
  // Q1_MANAGEMENT
  Q1_MANAGEMENT: {
    VIEW: 'menuPermission.edi.q1management.view',
    CREATE: 'menuPermission.edi.q1management.create',
    MODIFY: 'menuPermission.edi.q1management.modify',
    DELETE: 'menuPermission.edi.q1management.delete',
  },

  // Q2_MANAGEMENT
  Q2_MANAGEMENT: {
    VIEW: 'menuPermission.edi.q2management.view',
  },
};
// Add more error messages as needed
