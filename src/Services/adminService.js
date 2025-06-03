import { fetcher } from './api';

const adminService = {
  // Obtener datos del dashboard
  getDashboard: () => fetcher('/api/Admin/dashboard'),
  
  // Obtener todos los usuarios
  getUsers: () => fetcher('/api/Admin/users'),
  
  // Asignar rol a un usuario
  assignRole: (userId, roleName) => fetcher('/api/Admin/assign-role', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      roleName
    })
  }),
  
  // Eliminar un usuario
  deleteUser: (userId) => fetcher(`/api/Admin/users/${userId}`, {
    method: 'DELETE'
  })
};

export default adminService; 