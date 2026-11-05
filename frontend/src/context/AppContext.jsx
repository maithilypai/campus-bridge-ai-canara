import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSkills } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Auth view: 'login' or 'signup'
  const [authView, setAuthView] = useState('login');

  // Registered users stored in localStorage (demonstration auth)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_bridge_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current logged in user (null if not authenticated)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_bridge_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User activity log
  const [activities, setActivities] = useState([]);

  // Load activities when currentUser changes
  useEffect(() => {
    if (currentUser?.usn) {
      try {
        const savedActs = localStorage.getItem(`campus_bridge_activities_${currentUser.usn}`);
        setActivities(savedActs ? JSON.parse(savedActs) : []);
      } catch {
        setActivities([]);
      }
    } else {
      setActivities([]);
    }
  }, [currentUser?.usn]);

  // Skills state
  const [skills, setSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_bridge_skills');
      return saved ? JSON.parse(saved) : initialSkills;
    } catch {
      return initialSkills;
    }
  });

  // Bookmarked resource IDs
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_bridge_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Resource preview modal state
  const [previewResource, setPreviewResource] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Save users array to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('campus_bridge_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  // Save currentUser to localStorage whenever it changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('campus_bridge_current_user', JSON.stringify(currentUser));
        // Also keep users array in sync
        setUsers(prev => {
          const idx = prev.findIndex(u => u.usn.toLowerCase() === currentUser.usn.toLowerCase());
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = currentUser;
            return copy;
          }
          return [...prev, currentUser];
        });
      } else {
        localStorage.removeItem('campus_bridge_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Persist Skills
  useEffect(() => {
    try {
      localStorage.setItem('campus_bridge_skills', JSON.stringify(skills));
    } catch (e) {
      console.error(e);
    }
  }, [skills]);

  // Persist Bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('campus_bridge_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  const showToast = (title, message = '', type = 'purple') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addActivity = (title, description, badge = 'General') => {
    if (!currentUser?.usn) return;
    const newAct = {
      id: 'act-' + Date.now(),
      title,
      description,
      badge,
      time: 'Just now'
    };
    setActivities(prev => {
      const updated = [newAct, ...prev].slice(0, 15);
      try {
        localStorage.setItem(`campus_bridge_activities_${currentUser.usn}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Auth: Login function
  const login = (identifier, password) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    const matchedUser = users.find(u =>
      (u.usn.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
      u.password === cleanPass
    );

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setActiveTab('dashboard');
      showToast("Welcome Back!", `Logged in as ${matchedUser.name}`, "purple");
      return { success: true };
    } else {
      return {
        success: false,
        error: "Invalid USN/Email or password. Please verify your credentials or create a new student account."
      };
    }
  };

  // Auth: Sign Up function
  const signup = (userData) => {
    const cleanUsn = userData.usn.trim().toUpperCase();
    const cleanEmail = userData.email.trim().toLowerCase();

    // Check if user already exists
    const existing = users.find(u =>
      u.usn.toUpperCase() === cleanUsn ||
      u.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      return {
        success: false,
        error: "A student account with this USN or Email already exists. Please log in instead."
      };
    }

    const newUser = {
      name: userData.name.trim(),
      usn: cleanUsn,
      email: cleanEmail,
      password: userData.password,
      department: userData.department || "Artificial Intelligence & Machine Learning",
      shortDept: userData.department?.includes('Artificial') ? 'AIML' : (userData.department || 'AIML'),
      year: userData.year || "1st Year",
      semester: Number(userData.semester) || 1,
      section: userData.section || "A",
      college: "Canara Engineering College",
      location: "Benjanapadavu, Bantwal, Mangaluru - 574219",
      affiliation: "Affiliated to Visvesvaraya Technological University (VTU), Belagavi",
      vtuScheme: "2021/2022 Scheme",
      bio: "",
      phone: "",
      cgpa: null,
      attendance: null,
      earnedCredits: 0,
      totalProgramCredits: 160,
      projects: [],
      certifications: [],
      semesterHistory: []
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveTab('dashboard');
    showToast("Account Created", `Welcome to Campus Bridge AI, ${newUser.name}!`, "purple");
    return { success: true };
  };

  // Auth: Logout function
  const logout = () => {
    setCurrentUser(null);
    setAuthView('login');
    setActiveTab('dashboard');
    showToast("Logged Out", "You have been logged out of your session.", "info");
  };

  const updateCurrentUser = (updatedData) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      addActivity("Profile Updated", "Modified student profile details", "Profile");
      return updated;
    });
    showToast("Profile Updated", "Your changes have been saved successfully.", "purple");
  };

  const addProject = (project) => {
    if (!currentUser) return;
    const newProj = {
      id: "proj-" + Date.now(),
      ...project
    };
    setCurrentUser(prev => ({
      ...prev,
      projects: [newProj, ...(prev.projects || [])]
    }));
    addActivity("Added Project", `Created project: "${project.title}"`, "Projects");
    showToast("Project Added", `"${project.title}" was saved to your profile.`, "purple");
  };

  const addCertification = (cert) => {
    if (!currentUser) return;
    const newCert = {
      id: "cert-" + Date.now(),
      ...cert
    };
    setCurrentUser(prev => ({
      ...prev,
      certifications: [newCert, ...(prev.certifications || [])]
    }));
    addActivity("Added Certificate", `Recorded: "${cert.title}"`, "Certificates");
    showToast("Certificate Added", `"${cert.title}" saved.`, "purple");
  };

  const saveSemesterSgpa = (semName, sgpaValue, creditsValue) => {
    if (!currentUser) return;
    const sg = parseFloat(sgpaValue);
    const cr = parseFloat(creditsValue);

    setCurrentUser(prev => {
      const history = [...(prev.semesterHistory || [])];
      const existingIdx = history.findIndex(s => s.sem.toLowerCase() === semName.toLowerCase());
      
      const entry = {
        sem: semName,
        sgpa: sg,
        credits: cr,
        status: sg >= 4.0 ? "Passed" : "Needs Clearance"
      };

      if (existingIdx !== -1) {
        history[existingIdx] = entry;
      } else {
        history.push(entry);
      }

      // Compute cumulative CGPA & Total Credits
      let totalPts = 0;
      let totalCr = 0;
      history.forEach(item => {
        totalPts += (item.sgpa * item.credits);
        totalCr += item.credits;
      });

      const newCgpa = totalCr > 0 ? parseFloat((totalPts / totalCr).toFixed(2)) : null;

      addActivity("Calculated SGPA", `Recorded ${semName} SGPA: ${sg.toFixed(2)}`, "Calculator");

      return {
        ...prev,
        semesterHistory: history,
        cgpa: newCgpa,
        earnedCredits: totalCr
      };
    });
  };

  const toggleBookmark = (resourceId) => {
    setBookmarks(prev => {
      const exists = prev.includes(resourceId);
      if (exists) {
        showToast("Bookmark removed", "Resource removed from your saved list.", "info");
        return prev.filter(id => id !== resourceId);
      } else {
        showToast("Bookmarked!", "Resource saved to your favorites.", "purple");
        addActivity("Saved Resource", `Bookmarked course module ${resourceId}`, "Resources");
        return [...prev, resourceId];
      }
    });
  };

  const updateSkillLevel = (skillName, newLevel) => {
    setSkills(prev => prev.map(s => s.name === skillName ? { ...s, level: newLevel } : s));
    showToast("Skill Adjusted", `Updated proficiency for ${skillName}`, "purple");
    addActivity("Skill Updated", `Adjusted self-assessment for ${skillName}`, "Skills");
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        authView,
        setAuthView,
        currentUser,
        users,
        login,
        signup,
        logout,
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
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
