import React, { useState, useEffect } from 'react';
import { User, Mail, BookOpen, Award, Calendar, TrendingUp, GraduationCap, Brain } from 'lucide-react';
import Layout from '../layout/Layout';
import { useStudentData } from '../../hooks/useStudentData';
import LoadingSpinner from '../UI/LoadingSpinner';

const StudentProfile = () => {
  const { currentStudentId, userRole } = useStudentData();
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/student/${currentStudentId}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStudentInfo(data);
        } else {
          setStudentInfo({
            id: currentStudentId,
            name: `Student ${currentStudentId}`,
            email: `student${currentStudentId}@nwu.ac.za`,
            major: 'Computer Science',
            academicLevel: 'Third Year',
            currentGPA: 3.45,
            personalityType: 'Analytical Learner',
            enrollmentDate: '2022-01-15',
            expectedGraduation: '2025-12-15',
            riskLevel: 'low'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setStudentInfo({
          id: currentStudentId,
          name: `Student ${currentStudentId}`,
          email: `student${currentStudentId}@nwu.ac.za`,
          major: 'Computer Science',
          academicLevel: 'Third Year',
          currentGPA: 3.45,
          personalityType: 'Analytical Learner',
          enrollmentDate: '2022-01-15',
          expectedGraduation: '2025-12-15',
          riskLevel: 'low'
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentStudentId) {
      fetchStudentProfile();
    }
  }, [currentStudentId]);

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (!studentInfo) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">No profile information available</p>
        </div>
      </Layout>
    );
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Student Profile</h1>
          <p className="text-gray-400 mt-2 text-lg">Your academic information and details</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-48" style={{backgroundColor: '#8b57d4'}}>
            <div className="absolute -bottom-20 left-8">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden" style={{backgroundColor: '#6d3db8'}}>
                {studentInfo.profileImage ? (
                  <img src={studentInfo.profileImage} alt={studentInfo.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-20 h-20 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-24 pb-8 px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{studentInfo.name}</h2>
                <p className="text-gray-600 flex items-center gap-2 mt-2 text-lg">
                  <Mail className="w-5 h-5" />
                  {studentInfo.email}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className={`px-6 py-3 rounded-full text-base font-medium ${getRiskColor(studentInfo.riskLevel)}`}>
                  Risk Level: {studentInfo.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg" style={{backgroundColor: '#8b57d41A'}}>
                    <BookOpen className="w-6 h-6" style={{color: '#8b57d4'}} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Academic Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Student ID:</span>
                    <span className="font-medium text-gray-900">{studentInfo.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Major:</span>
                    <span className="font-medium text-gray-900">{studentInfo.major}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Academic Level:</span>
                    <span className="font-medium text-gray-900">{studentInfo.academicLevel}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Performance</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Current GPA:</span>
                    <span className="font-medium text-gray-900">{studentInfo.currentGPA.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Learning Style:</span>
                    <span className="font-medium text-gray-900">{studentInfo.personalityType}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Important Dates</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Enrollment Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(studentInfo.enrollmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Expected Graduation:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(studentInfo.expectedGraduation).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Learning Profile</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Personality Type:</span>
                    <span className="font-medium text-gray-900">{studentInfo.personalityType}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Risk Assessment:</span>
                    <span className={`font-medium capitalize ${getRiskColor(studentInfo.riskLevel).split(' ')[0]}`}>
                      {studentInfo.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{backgroundColor: '#8b57d41A'}}>
              <GraduationCap className="w-8 h-8" style={{color: '#8b57d4'}} />
            </div>
            <h3 className="text-4xl font-bold text-gray-900">{studentInfo.currentGPA.toFixed(2)}</h3>
            <p className="text-gray-600 mt-2">Current GPA</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{studentInfo.academicLevel}</h3>
            <p className="text-gray-600 mt-2">Academic Level</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{studentInfo.major}</h3>
            <p className="text-gray-600 mt-2">Major</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Academic Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Overall Progress</span>
                  <span className="font-semibold text-gray-900">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="h-3 rounded-full" style={{backgroundColor: '#8b57d4', width: '75%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Course Completion</span>
                  <span className="font-semibold text-gray-900">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{width: '82%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Assignment Success Rate</span>
                  <span className="font-semibold text-gray-900">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{width: '88%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold" style={{color: '#8b57d4'}}>12</p>
                <p className="text-sm text-gray-600 mt-1">Courses Completed</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">4</p>
                <p className="text-sm text-gray-600 mt-1">Current Courses</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">3.45</p>
                <p className="text-sm text-gray-600 mt-1">Cumulative GPA</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-orange-600">56</p>
                <p className="text-sm text-gray-600 mt-1">Credits Earned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;