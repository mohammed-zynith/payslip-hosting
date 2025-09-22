// components/EmployeeDashboard.jsx
import { useState } from 'react'
import EmployeeDetails from './EmployeeDetails'

const EmployeeDashboard = ({ employees, loading, onRefresh }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="loading">Loading employees...</div>
  }

  return (
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <h2>Employee Dashboard</h2>
        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={onRefresh} className="btn-refresh">Refresh</button>
        </div>
      </div>

      <div className="employee-list">
        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            {employees.length === 0 
              ? 'No employees found. Add your first employee to get started.' 
              : 'No employees match your search.'}
          </div>
        ) : (
          filteredEmployees.map(employee => (
            <div 
              key={employee._id} 
              className={`employee-card ${selectedEmployee?._id === employee._id ? 'selected' : ''}`}
              onClick={() => setSelectedEmployee(employee)}
            >
              <div className="employee-basic">
                <h3>{employee.name}</h3>
                <p>{employee.designation}</p>
                <p className="employee-id">ID: {employee.employeeId}</p>
              </div>
              <div className="employee-pay">
                <p className="net-pay">₹{employee.salary?.toFixed(2) || '0.00'}</p>
                <p className="pay-period">{employee.month}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedEmployee && (
        <EmployeeDetails 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  )
}

export default EmployeeDashboard


// import { useState } from 'react'
// import EmployeeDetails from './EmployeeDetails'
// import EmployeeUpdateForm from './EditEmployeeForm' // Changed from EditEmployeeForm
// import { deleteEmployee } from '../services/api'

// const EmployeeDashboard = ({ employees, loading, onRefresh }) => {
//   const [selectedEmployee, setSelectedEmployee] = useState(null)
//   const [updatingEmployee, setUpdatingEmployee] = useState(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [error, setError] = useState('')

//   const filteredEmployees = employees.filter(emp => 
//     emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   // API call to delete an employee
//   const handleDeleteEmployee = async (employeeId) => {
//     if (window.confirm('Are you sure you want to delete this employee?')) {
//       try {
//         setError('')
//         await deleteEmployee(employeeId)
//         onRefresh()
//         alert('Employee deleted successfully')
//         if (selectedEmployee && selectedEmployee.employeeId === employeeId) {
//           setSelectedEmployee(null)
//         }
//       } catch (error) {
//         console.error('Error deleting employee:', error)
//         setError('Failed to delete employee: ' + (error.response?.data?.error || error.message))
//         alert('Failed to delete employee: ' + (error.response?.data?.error || error.message))
//       }
//     }
//   }

//   // Function to handle update button click
//   const handleUpdateClick = (employee) => {
//     setUpdatingEmployee(employee)
//   }

//   if (loading) {
//     return <div className="loading">Loading employees...</div>
//   }

//   return (
//     <div className="employee-dashboard">
//       <div className="dashboard-header">
//         <h2>Employee Dashboard</h2>
//         <div className="dashboard-controls">
//           <input
//             type="text"
//             placeholder="Search employees..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//           <button onClick={onRefresh} className="btn-refresh">Refresh</button>
//         </div>
//       </div>

//       {error && <div className="error-message">{error}</div>}

//       <div className="employee-list">
//         {filteredEmployees.length === 0 ? (
//           <div className="empty-state">
//             {employees.length === 0 
//               ? 'No employees found. Add your first employee to get started.' 
//               : 'No employees match your search.'}
//           </div>
//         ) : (
//           filteredEmployees.map(employee => (
//             <div 
//               key={employee._id} 
//               className={`employee-card ${selectedEmployee?._id === employee._id ? 'selected' : ''}`}
//             >
//               <div className="employee-card-content">
//                 <div 
//                   className="employee-info-clickable"
//                   onClick={() => setSelectedEmployee(employee)}
//                 >
//                   <div className="employee-basic">
//                     <h3>{employee.name}</h3>
//                     <p>{employee.designation}</p>
//                     <p className="employee-id">ID: {employee.employeeId}</p>
//                   </div>
//                   <div className="employee-pay">
//                     <p className="net-pay">₹{employee.netPay?.toFixed(2) || '0.00'}</p>
//                     <p className="pay-period">{employee.month}</p>
//                   </div>
//                 </div>
                
//                 <div className="employee-actions">
//                   <button 
//                     className="btn-update"
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       handleUpdateClick(employee)
//                     }}
//                     title="Update employee"
//                   >
//                     🔄
//                   </button>
//                   <button 
//                     className="btn-delete"
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       handleDeleteEmployee(employee.employeeId) // Changed from _id to employeeId
//                     }}
//                     title="Delete employee"
//                   >
//                     🗑️
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {selectedEmployee && (
//         <EmployeeDetails 
//           employee={selectedEmployee} 
//           onClose={() => setSelectedEmployee(null)}
//           onUpdate={() => handleUpdateClick(selectedEmployee)}
//           onDelete={() => handleDeleteEmployee(selectedEmployee.employeeId)} // Changed from _id to employeeId
//         />
//       )}

//       {updatingEmployee && (
//         <EmployeeUpdateForm 
//           employeeId={updatingEmployee.employeeId} // Changed from _id to employeeId
//           onEmployeeUpdated={() => {
//             onRefresh()
//             setUpdatingEmployee(null)
//             setSelectedEmployee(null)
//           }}
//           onCancel={() => setUpdatingEmployee(null)}
//         />
//       )}
//     </div>
//   )
// }

// export default EmployeeDashboard