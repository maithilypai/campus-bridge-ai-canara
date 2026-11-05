import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialSkills } from '../data/mockData';
import { registerStudent, loginStudent, getMyProfile, tokenStore } from '../services/api';

const AppContext = createContext();

/**
 * Normalise a backend student object into the shape the UI expects.
 * Backend fields → UI fields:
 *   fullName      → name
 *   USN           → usn
 *   collegeEmail  → email
 *   academicYear  → year
 *   (all others pass through unchanged)
 *
 * Also derives shortDept and other UI-only fields from real data.
 */
function normaliseStudent(backendStudent) {
  if (!backendStudent) return null;
  const dept = backendStudent.department || '';

  // Derive a short department code for display
  const shortDept = (() => {
    if (dept.toLowerCase().includes('artificial') || dept.toLowerCase().includes('aiml')) return 'AIML';
    if (dept.toLowerCase().includes('computer')) return 'CSE';
    if (dept.toLowerCase().includes('information')) return 'ISE';
    if (dept.toLowerCase().includes('mechanical')) return 'ME';
    if (dept.toLowerCase().includes('civil')) return 'CV';
    if (dept.toLowerCase().includes('electrical')) return 'EEE';
    if (dept.toLowerCase().includes('electronics')) return 'ECE';
    // Fallback: take first word initials up to 4 chars
    return dept.split(/[\s&]+/).map(w => w[0]).join('').toUpperCase().slice(0, 4);
  })();

  return {
    // ── Identity (from backend) ──
    id:           backendStudent.id || backendStudent._id,
    name:         backendStudent.fullName,
    usn:          backendStudent.USN,
    email:        backendStudent.collegeEmail,
    department:   dept,
    shortDept,
    year:         backendStudent.academicYear,
    semester:     Number(backendStudent.semester) || 1,
    role:         String(backendStudent.role || 'student').toLowerCase().trim(),

    // ── UI-only profile extras (not stored in backend yet) ──
    // These persist in localStorage keyed by USN so they survive refresh.
    section:          backendStudent.section      || '',
    bio:              backendStudent.bio          || '',
    phone:            backendStudent.phone        || '',

    // ── Academic tracking (local only) ──
    cgpa:             backendStudent.cgpa         ?? null,
    attendance:       backendStudent.attendance   ?? null,
    earnedCredits:    backendStudent.earnedCredits ?? 0,
    totalProgramCredits: 160,
    projects:         backendStudent.projects        || [],
    certifications:   backendStudent.certifications  || [],
    semesterHistory:  backendStudent.semesterHistory  || [],

    // ── Metadata ──
    college:     'Canara Engineering College',
    location:    'Benjanapadavu, Bantwal, Mangaluru - 574219',
    affiliation: 'Affiliated to Visvesvaraya Technological University (VTU), Belagavi',
    curriculumScheme: 'Autonomous Scheme',
    scheme:           'Canara Autonomous Scheme (2024+)',
  };
}

/**
 * Load UI-only profile extras from localStorage for a given USN.
 * These are non-sensitive display fields (bio, phone, section, projects, etc.)
 * that the backend does not currently store.
 */
function loadLocalExtras(usn) {
  if (!usn) return {};
  try {
    const saved = localStorage.getItem(`cb_extras_${usn.toUpperCase()}`);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveLocalExtras(usn, extras) {
  if (!usn) return;
  try {
    localStorage.setItem(`cb_extras_${usn.toUpperCase()}`, JSON.stringify(extras));
  } catch (e) {
    console.error('[AppContext] Failed to save local extras:', e);
  }
}

export function AppProvider({ children }) {
  // ── Navigation ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]   = useState('dashboard');
  const [authView, setAuthView]     = useState('login');

  // ── Auth state ────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true during session restore

  // ── Feature state ─────────────────────────────────────────────────────
  const [activities, setActivities] = useState([]);

  const [skills, setSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_bridge_skills');
      return saved ? JSON.parse(saved) : initialSkills;
    } catch { return initialSkills; }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_bridge_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [previewResource, setPreviewResource] = useState(null);
  const [toasts, setToasts]                   = useState([]);

  // ── Toast ─────────────────────────────────────────────────────────────
  const showToast = useCallback((title, message = '', type = 'purple') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Activity log ──────────────────────────────────────────────────────
  const addActivity = useCallback((title, description, badge = 'General') => {
    setActivities(prev => {
      const newAct = { id: 'act-' + Date.now(), title, description, badge, time: 'Just now' };
      return [newAct, ...prev].slice(0, 15);
    });
  }, []);

  // ── Persist features ──────────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem('campus_bridge_skills', JSON.stringify(skills)); }
    catch (e) { console.error(e); }
  }, [skills]);

  useEffect(() => {
    try { localStorage.setItem('campus_bridge_bookmarks', JSON.stringify(bookmarks)); }
    catch (e) { console.error(e); }
  }, [bookmarks]);

  // Load activities when user changes
  useEffect(() => {
    if (currentUser?.usn) {
      try {
        const saved = localStorage.getItem(`campus_bridge_activities_${currentUser.usn}`);
        setActivities(saved ? JSON.parse(saved) : []);
      } catch { setActivities([]); }
    } else {
      setActivities([]);
    }
  }, [currentUser?.usn]);

  // Persist activities
  useEffect(() => {
    if (currentUser?.usn && activities.length > 0) {
      try {
        localStorage.setItem(`campus_bridge_activities_${currentUser.usn}`, JSON.stringify(activities));
      } catch (e) { console.error(e); }
    }
  }, [activities, currentUser?.usn]);

  // ── Session restore on mount ──────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const token = tokenStore.get();
      if (!token) {
        setAuthLoading(false);
        return;
      }

      const { data, error } = await getMyProfile();

      if (error || !data?.data?.student) {
        // Token invalid or expired — clear everything
        tokenStore.clear();
        setCurrentUser(null);
        setAuthLoading(false);
        return;
      }

      const student = data.data.student;
      const extras  = loadLocalExtras(student.USN);
      // Clean extras: ensure security & identity fields strictly come from verified backend data
      delete extras.role;
      delete extras.id;
      delete extras.name;
      delete extras.usn;
      delete extras.email;
      delete extras.department;
      delete extras.year;
      delete extras.semester;
      const normalised = normaliseStudent(student);
      setCurrentUser({ ...extras, ...normalised });
      setAuthLoading(false);
    };

    restoreSession();
  }, []);

  // ── Manual Profile & Role Re-sync ─────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    const token = tokenStore.get();
    if (!token) return { success: false, error: 'No active session token' };

    const { data, error } = await getMyProfile();
    if (error || !data?.data?.student) {
      return { success: false, error: error || 'Failed to refresh profile' };
    }

    const student = data.data.student;
    const extras = loadLocalExtras(student.USN);
    delete extras.role;
    delete extras.id;
    delete extras.name;
    delete extras.usn;
    delete extras.email;
    delete extras.department;
    delete extras.year;
    delete extras.semester;
    const normalised = normaliseStudent(student);
    setCurrentUser({ ...extras, ...normalised });
    return { success: true, student: normalised };
  }, []);

  // ── Auth: Signup ──────────────────────────────────────────────────────
  /**
   * Calls POST /api/auth/register.
   * On success saves token to sessionStorage and sets currentUser.
   */
  const signup = async (formData) => {
    const payload = {
      fullName      : formData.name,
      USN           : formData.usn,
      collegeEmail  : formData.email,
      department    : formData.department,
      academicYear  : formData.year,
      semester      : Number(formData.semester),
      password      : formData.password,
      confirmPassword: formData.confirmPassword,
    };

    const { data, error } = await registerStudent(payload);

    if (error) {
      return { success: false, error };
    }

    // Save JWT
    tokenStore.set(data.token);

    // Build user object from returned student profile
    const student = data.data.student;
    const normalised = normaliseStudent(student);
    setCurrentUser(normalised);
    setActiveTab('dashboard');
    showToast('Account Created', `Welcome to Campus Bridge AI, ${normalised.name}!`, 'purple');
    return { success: true };
  };

  // ── Auth: Login ───────────────────────────────────────────────────────
  /**
   * Calls POST /api/auth/login.
   * On success fetches profile from /api/auth/me (to get latest data),
   * saves token and updates currentUser.
   */
  const login = async (identifier, password) => {
    const { data, error } = await loginStudent({ identifier, password });

    if (error) {
      return { success: false, error };
    }

    // Save JWT
    tokenStore.set(data.token);

    // Fetch full profile
    const profileRes = await getMyProfile();
    if (profileRes.error || !profileRes.data?.data?.student) {
      return { success: false, error: 'Login succeeded but profile could not be loaded. Please try again.' };
    }

    const student    = profileRes.data.data.student;
    const extras     = loadLocalExtras(student.USN);
    delete extras.role;
    delete extras.id;
    delete extras.name;
    delete extras.usn;
    delete extras.email;
    delete extras.department;
    delete extras.year;
    delete extras.semester;
    const normalised = normaliseStudent(student);

    setCurrentUser({ ...extras, ...normalised });
    setActiveTab('dashboard');
    showToast('Welcome Back!', `Logged in as ${normalised.name}`, 'purple');
    return { success: true };
  };

  // ── Auth: Logout ──────────────────────────────────────────────────────
  const logout = useCallback(() => {
    tokenStore.clear();
    setCurrentUser(null);
    setAuthView('login');
    setActiveTab('dashboard');
    showToast('Logged Out', 'You have been signed out of your session.', 'info');
  }, [showToast]);

  // ── Profile update ────────────────────────────────────────────────────
  /**
   * Updates UI-only profile fields locally.
   * Backend profile update API is a future step — for now extras persist
   * in localStorage keyed by USN.
   */
  const updateCurrentUser = useCallback((updatedData) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };

      // Persist non-sensitive extras (bio, phone, section, etc.) locally
      const extras = {
        bio           : updated.bio,
        phone         : updated.phone,
        section       : updated.section,
        cgpa          : updated.cgpa,
        attendance    : updated.attendance,
        earnedCredits : updated.earnedCredits,
        projects      : updated.projects,
        certifications: updated.certifications,
        semesterHistory: updated.semesterHistory,
      };
      saveLocalExtras(updated.usn, extras);

      return updated;
    });
    addActivity('Profile Updated', 'Modified student profile details', 'Profile');
    showToast('Profile Updated', 'Your changes have been saved.', 'purple');
  }, [addActivity, showToast]);

  // ── Projects ──────────────────────────────────────────────────────────
  const addProject = useCallback((project) => {
    if (!currentUser) return;
    const newProj = { id: 'proj-' + Date.now(), ...project };
    setCurrentUser(prev => {
      const updated = { ...prev, projects: [newProj, ...(prev.projects || [])] };
      saveLocalExtras(updated.usn, {
        bio: updated.bio, phone: updated.phone, section: updated.section,
        cgpa: updated.cgpa, attendance: updated.attendance,
        earnedCredits: updated.earnedCredits, projects: updated.projects,
        certifications: updated.certifications, semesterHistory: updated.semesterHistory,
      });
      return updated;
    });
    addActivity('Added Project', `Created project: "${project.title}"`, 'Projects');
    showToast('Project Added', `"${project.title}" saved to your profile.`, 'purple');
  }, [currentUser, addActivity, showToast]);

  // ── Certifications ────────────────────────────────────────────────────
  const addCertification = useCallback((cert) => {
    if (!currentUser) return;
    const newCert = { id: 'cert-' + Date.now(), ...cert };
    setCurrentUser(prev => {
      const updated = { ...prev, certifications: [newCert, ...(prev.certifications || [])] };
      saveLocalExtras(updated.usn, {
        bio: updated.bio, phone: updated.phone, section: updated.section,
        cgpa: updated.cgpa, attendance: updated.attendance,
        earnedCredits: updated.earnedCredits, projects: updated.projects,
        certifications: updated.certifications, semesterHistory: updated.semesterHistory,
      });
      return updated;
    });
    addActivity('Added Certificate', `Recorded: "${cert.title}"`, 'Certificates');
    showToast('Certificate Added', `"${cert.title}" saved.`, 'purple');
  }, [currentUser, addActivity, showToast]);

  // ── SGPA / CGPA ───────────────────────────────────────────────────────
  const saveSemesterSgpa = useCallback((semName, sgpaValue, creditsValue) => {
    if (!currentUser) return;
    const sg = parseFloat(sgpaValue);
    const cr = parseFloat(creditsValue);

    setCurrentUser(prev => {
      const history = [...(prev.semesterHistory || [])];
      const existingIdx = history.findIndex(s => s.sem.toLowerCase() === semName.toLowerCase());
      const entry = { sem: semName, sgpa: sg, credits: cr, status: sg >= 4.0 ? 'Passed' : 'Needs Clearance' };

      if (existingIdx !== -1) { history[existingIdx] = entry; }
      else { history.push(entry); }

      let totalPts = 0, totalCr = 0;
      history.forEach(item => { totalPts += (item.sgpa * item.credits); totalCr += item.credits; });
      const newCgpa = totalCr > 0 ? parseFloat((totalPts / totalCr).toFixed(2)) : null;

      const updated = { ...prev, semesterHistory: history, cgpa: newCgpa, earnedCredits: totalCr };
      saveLocalExtras(updated.usn, {
        bio: updated.bio, phone: updated.phone, section: updated.section,
        cgpa: updated.cgpa, attendance: updated.attendance,
        earnedCredits: updated.earnedCredits, projects: updated.projects,
        certifications: updated.certifications, semesterHistory: history,
      });
      return updated;
    });
    addActivity('Calculated SGPA', `Recorded ${semName} SGPA: ${sg.toFixed(2)}`, 'Calculator');
  }, [currentUser, addActivity]);

  // ── Bookmarks ─────────────────────────────────────────────────────────
  const toggleBookmark = useCallback((resourceId) => {
    setBookmarks(prev => {
      const exists = prev.includes(resourceId);
      if (exists) {
        showToast('Bookmark removed', 'Resource removed from your saved list.', 'info');
        return prev.filter(id => id !== resourceId);
      } else {
        showToast('Bookmarked!', 'Resource saved to your favorites.', 'purple');
        addActivity('Saved Resource', `Bookmarked course module ${resourceId}`, 'Resources');
        return [...prev, resourceId];
      }
    });
  }, [showToast, addActivity]);

  // ── Skills ────────────────────────────────────────────────────────────
  const updateSkillLevel = useCallback((skillName, newLevel) => {
    setSkills(prev => prev.map(s => s.name === skillName ? { ...s, level: newLevel } : s));
    showToast('Skill Adjusted', `Updated proficiency for ${skillName}`, 'purple');
    addActivity('Skill Updated', `Adjusted self-assessment for ${skillName}`, 'Skills');
  }, [showToast, addActivity]);

  // ── Context value ─────────────────────────────────────────────────────
  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        authView,
        setAuthView,
        currentUser,
        authLoading,
        login,
        signup,
        logout,
        refreshProfile,
        updateCurrentUser,
        addProject,
        addCertification,
        saveSemesterSgpa,
        activities,
        addActivity,
        skills,
        updateSkillLevel,
        bookmarks,
        toggleBookmark,
        previewResource,
        setPreviewResource,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
