import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent, searchStudents } from '../services/students';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaUserGraduate } from 'react-icons/fa';
import Modal from '../components/Modal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const fetchStudents = async () => {
    try {
      let data;
      if (search) {
        data = await searchStudents(search);
      } else {
        data = await getStudents();
      }
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      await deleteStudent(studentToDelete.id);
      setStudents(students.filter(s => s.id !== studentToDelete.id));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Error deleting student. They might have active borrowed books.');
    }
  };

  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold text-white mb-1">Student Registry</h4>
          <p className="text-secondary mb-0 fs-7">Manage student borrowing profiles and permissions.</p>
        </div>
        <Link to="/students/add" className="btn btn-gold d-flex align-items-center gap-2">
          <FaPlus /> Add New Student
        </Link>
      </div>

      <div className="glass-card p-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search student by name, Roll ID, department..." />
      </div>

      {loading ? (
        <Loader message="Fetching registered students data..." />
      ) : (
        <div className="glass-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Roll ID</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td className="fw-bold text-warning">{student.student_id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="d-flex align-items-center justify-content-center bg-secondary rounded-circle" style={{ width: '32px', height: '32px' }}>
                            <FaUserGraduate className="text-white" size={14} />
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td>{student.department}</td>
                      <td>Year {student.year}</td>
                      <td>{student.email}</td>
                      <td>
                        <span className={`badge ${student.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} px-2.5 py-1.5`}>
                          {student.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Link to={`/students/edit/${student.id}`} className="btn btn-outline-gold btn-sm p-1.5 rounded-3" title="Edit Profile">
                            <FaEdit size={14} />
                          </Link>
                          <button className="btn btn-outline-danger btn-sm p-1.5 rounded-3" title="Delete Profile" onClick={() => openDeleteModal(student)}>
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-secondary py-5">No student records registered.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="Remove Student Record"
        footerActions={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteConfirm}>Remove Student</button>
          </>
        }
      >
        <p className="fs-7 mb-0">Are you sure you want to remove student <strong>{studentToDelete?.name} ({studentToDelete?.student_id})</strong>? This deletion is permanent.</p>
      </Modal>
    </div>
  );
};

export default Students;
