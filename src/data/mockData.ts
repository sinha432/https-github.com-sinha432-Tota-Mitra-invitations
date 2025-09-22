export interface Worker {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female'
  group: string
  skills: string[]
  availability: boolean
  contact: {
    phone: string
    email: string
  }
  rating: number
  languages: string[]
  location: string
  profilePic: string
}

export interface Task {
  id: string
  title: string
  type: 'Arecanut Harvesting' | 'Coconut Harvesting' | 'Pepper Vine Support Work' | 'Banana Cultivation Assistance' | 'Arecanut Medicine Spray' | 'General Farm Labor'
  date: string
  workersNeeded: number
  assignedWorkers: string[]
  status: 'pending' | 'approved' | 'completed' | 'cancelled'
  location: string
  duration: string
  description: string
  createdBy: string
  createdAt: string
}

export interface Feedback {
  id: string
  taskId: string
  workerId: string
  workerName: string
  rating: number
  comment: string
  createdAt: string
}

export interface EmployerFeedback {
  id: string
  subject: string
  comment: string
  category: 'Workers' | 'Tasks' | 'General' | 'Performance' | 'Safety'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  employerName: string
  createdAt: string
}

export const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'Harish Rao',
    age: 44,
    gender: 'Female',
    group: 'Group 1',
    skills: ['Arecanut Harvesting', 'Arecanut Medicine Spray', 'Banana Cultivation Assistance'],
    availability: false,
    contact: {
      phone: '9689313091',
      email: 'harish.rao@example.com'
    },
    rating: 3.2,
    languages: ['Kannada', 'English'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Ramesh Shenoy',
    age: 24,
    gender: 'Female',
    group: 'Group 1',
    skills: ['Pepper Vine Support Work', 'Arecanut Harvesting'],
    availability: true,
    contact: {
      phone: '9553481929',
      email: 'ramesh.shenoy@example.com'
    },
    rating: 3.9,
    languages: ['Kannada', 'English'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Meena Acharya',
    age: 45,
    gender: 'Male',
    group: 'Group 1',
    skills: ['Pepper Vine Support Work'],
    availability: true,
    contact: {
      phone: '9173880526',
      email: 'meena.acharya@example.com'
    },
    rating: 4.7,
    languages: ['Kannada', 'English'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'Radha Acharya',
    age: 22,
    gender: 'Female',
    group: 'Group 1',
    skills: ['General Farm Labor', 'Coconut Harvesting', 'Arecanut Harvesting'],
    availability: false,
    contact: {
      phone: '9487371212',
      email: 'radha.acharya@example.com'
    },
    rating: 4.2,
    languages: ['Kannada', 'English'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '5',
    name: 'Suresh Poojary',
    age: 31,
    gender: 'Female',
    group: 'Group 1',
    skills: ['Banana Cultivation Assistance', 'Coconut Harvesting'],
    availability: true,
    contact: {
      phone: '9527530888',
      email: 'suresh.poojary@example.com'
    },
    rating: 4.9,
    languages: ['Kannada'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '6',
    name: 'Umesh Naik',
    age: 41,
    gender: 'Female',
    group: 'Group 1',
    skills: ['Pepper Vine Support Work', 'General Farm Labor', 'Coconut Harvesting'],
    availability: true,
    contact: {
      phone: '9454065103',
      email: 'umesh.naik@example.com'
    },
    rating: 4.0,
    languages: ['Kannada', 'English'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '7',
    name: 'Ramesh Poojary',
    age: 23,
    gender: 'Male',
    group: 'Group 1',
    skills: ['Arecanut Medicine Spray', 'Pepper Vine Support Work'],
    availability: true,
    contact: {
      phone: '9983237199',
      email: 'ramesh.poojary@example.com'
    },
    rating: 3.1,
    languages: ['Kannada'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '8',
    name: 'Latha Pai',
    age: 39,
    gender: 'Male',
    group: 'Group 1',
    skills: ['Arecanut Harvesting', 'Arecanut Medicine Spray', 'General Farm Labor'],
    availability: true,
    contact: {
      phone: '9473460731',
      email: 'latha.pai@example.com'
    },
    rating: 3.0,
    languages: ['Kannada', 'English'],
    location: 'Bantwal',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '9',
    name: 'Rakesh Hegde',
    age: 27,
    gender: 'Male',
    group: 'Group 1',
    skills: ['Banana Cultivation Assistance'],
    availability: false,
    contact: {
      phone: '9381618709',
      email: 'rakesh.hegde@example.com'
    },
    rating: 3.0,
    languages: ['Kannada'],
    location: 'Sullia',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '10',
    name: 'Sunitha Kumar',
    age: 37,
    gender: 'Male',
    group: 'Group 1',
    skills: ['General Farm Labor'],
    availability: true,
    contact: {
      phone: '9080635968',
      email: 'sunitha.kumar@example.com'
    },
    rating: 4.3,
    languages: ['Kannada', 'English'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '11',
    name: 'Kavitha Pai',
    age: 30,
    gender: 'Female',
    group: 'Group 1',
    skills: ['Pepper Vine Support Work', 'General Farm Labor', 'Arecanut Medicine Spray'],
    availability: false,
    contact: {
      phone: '9031146018',
      email: 'kavitha.pai@example.com'
    },
    rating: 5.0,
    languages: ['Kannada'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  // Group 2
  {
    id: '12',
    name: 'Anitha Hegde',
    age: 35,
    gender: 'Female',
    group: 'Group 2',
    skills: ['Arecanut Harvesting', 'General Farm Labor', 'Arecanut Medicine Spray'],
    availability: true,
    contact: {
      phone: '9961198129',
      email: 'anitha.hegde@example.com'
    },
    rating: 4.7,
    languages: ['Kannada', 'English'],
    location: 'Sullia',
    profilePic: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '13',
    name: 'Umesh Kumar',
    age: 40,
    gender: 'Female',
    group: 'Group 2',
    skills: ['Banana Cultivation Assistance'],
    availability: true,
    contact: {
      phone: '9255903306',
      email: 'umesh.kumar@example.com'
    },
    rating: 4.1,
    languages: ['Kannada', 'English'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '14',
    name: 'Geetha Acharya',
    age: 23,
    gender: 'Male',
    group: 'Group 2',
    skills: ['Pepper Vine Support Work'],
    availability: false,
    contact: {
      phone: '9356083125',
      email: 'geetha.acharya@example.com'
    },
    rating: 4.8,
    languages: ['Kannada', 'English'],
    location: 'Sullia',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '15',
    name: 'Rakesh Bhat',
    age: 20,
    gender: 'Male',
    group: 'Group 2',
    skills: ['Pepper Vine Support Work'],
    availability: true,
    contact: {
      phone: '9899042801',
      email: 'rakesh.bhat@example.com'
    },
    rating: 4.3,
    languages: ['Kannada'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '16',
    name: 'Prakash Acharya',
    age: 41,
    gender: 'Female',
    group: 'Group 2',
    skills: ['Coconut Harvesting'],
    availability: false,
    contact: {
      phone: '9337497820',
      email: 'prakash.acharya@example.com'
    },
    rating: 3.7,
    languages: ['Kannada', 'English'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '17',
    name: 'Lakshmi Pai',
    age: 50,
    gender: 'Female',
    group: 'Group 2',
    skills: ['Arecanut Medicine Spray'],
    availability: false,
    contact: {
      phone: '9590816856',
      email: 'lakshmi.pai@example.com'
    },
    rating: 4.3,
    languages: ['Kannada', 'English'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '18',
    name: 'Ganesh Naik',
    age: 49,
    gender: 'Male',
    group: 'Group 2',
    skills: ['Arecanut Medicine Spray'],
    availability: false,
    contact: {
      phone: '9029151341',
      email: 'ganesh.naik@example.com'
    },
    rating: 3.3,
    languages: ['Kannada', 'English'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '19',
    name: 'Shobha Kumar',
    age: 48,
    gender: 'Male',
    group: 'Group 2',
    skills: ['Coconut Harvesting'],
    availability: false,
    contact: {
      phone: '9473525826',
      email: 'shobha.kumar@example.com'
    },
    rating: 4.5,
    languages: ['Kannada'],
    location: 'Bantwal',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '20',
    name: 'Rajesh Shenoy',
    age: 26,
    gender: 'Male',
    group: 'Group 2',
    skills: ['Coconut Harvesting'],
    availability: false,
    contact: {
      phone: '9617726924',
      email: 'rajesh.shenoy@example.com'
    },
    rating: 3.1,
    languages: ['Kannada', 'English'],
    location: 'Bantwal',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '21',
    name: 'Suresh Bhat',
    age: 21,
    gender: 'Male',
    group: 'Group 2',
    skills: ['Banana Cultivation Assistance'],
    availability: false,
    contact: {
      phone: '9373161143',
      email: 'suresh.bhat@example.com'
    },
    rating: 4.2,
    languages: ['Kannada'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '22',
    name: 'Rakesh Naik',
    age: 47,
    gender: 'Female',
    group: 'Group 2',
    skills: ['Arecanut Harvesting'],
    availability: false,
    contact: {
      phone: '9843983745',
      email: 'rakesh.naik@example.com'
    },
    rating: 3.6,
    languages: ['Kannada', 'English'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  // Group 3
  {
    id: '23',
    name: 'Shobha Pai',
    age: 27,
    gender: 'Male',
    group: 'Group 3',
    skills: ['Banana Cultivation Assistance'],
    availability: false,
    contact: {
      phone: '9369896168',
      email: 'shobha.pai@example.com'
    },
    rating: 4.1,
    languages: ['Kannada', 'English'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '24',
    name: 'Shobha Hegde',
    age: 30,
    gender: 'Female',
    group: 'Group 3',
    skills: ['Arecanut Harvesting'],
    availability: false,
    contact: {
      phone: '9100069339',
      email: 'shobha.hegde@example.com'
    },
    rating: 3.7,
    languages: ['Kannada'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '25',
    name: 'Rakesh Poojary',
    age: 22,
    gender: 'Male',
    group: 'Group 3',
    skills: ['Arecanut Harvesting'],
    availability: true,
    contact: {
      phone: '9734879239',
      email: 'rakesh.poojary@example.com'
    },
    rating: 4.8,
    languages: ['Kannada', 'English'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '26',
    name: 'Suresh Naik',
    age: 45,
    gender: 'Female',
    group: 'Group 3',
    skills: ['Arecanut Medicine Spray'],
    availability: true,
    contact: {
      phone: '9216128946',
      email: 'suresh.naik@example.com'
    },
    rating: 3.7,
    languages: ['Kannada', 'English'],
    location: 'Bantwal',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '27',
    name: 'Prakash Acharya',
    age: 28,
    gender: 'Female',
    group: 'Group 3',
    skills: ['Pepper Vine Support Work'],
    availability: true,
    contact: {
      phone: '9557694366',
      email: 'prakash.acharya@example.com'
    },
    rating: 3.5,
    languages: ['Kannada', 'English'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '28',
    name: 'Shobha Rao',
    age: 30,
    gender: 'Male',
    group: 'Group 3',
    skills: ['Arecanut Harvesting'],
    availability: true,
    contact: {
      phone: '9951008155',
      email: 'shobha.rao@example.com'
    },
    rating: 4.2,
    languages: ['Kannada', 'English'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '29',
    name: 'Harish Naik',
    age: 40,
    gender: 'Female',
    group: 'Group 3',
    skills: ['Pepper Vine Support Work'],
    availability: true,
    contact: {
      phone: '9056240366',
      email: 'harish.naik@example.com'
    },
    rating: 3.3,
    languages: ['Kannada'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '30',
    name: 'Rakesh Rao',
    age: 31,
    gender: 'Female',
    group: 'Group 3',
    skills: ['General Farm Labor'],
    availability: true,
    contact: {
      phone: '9992596038',
      email: 'rakesh.rao@example.com'
    },
    rating: 3.6,
    languages: ['Kannada'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '31',
    name: 'Kavitha Naik',
    age: 29,
    gender: 'Male',
    group: 'Group 3',
    skills: ['General Farm Labor'],
    availability: true,
    contact: {
      phone: '9565820633',
      email: 'kavitha.naik@example.com'
    },
    rating: 3.7,
    languages: ['Kannada'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '32',
    name: 'Sunitha Pai',
    age: 32,
    gender: 'Male',
    group: 'Group 3',
    skills: ['Coconut Harvesting'],
    availability: true,
    contact: {
      phone: '9430484941',
      email: 'sunitha.pai@example.com'
    },
    rating: 4.3,
    languages: ['Kannada'],
    location: 'Bantwal',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '33',
    name: 'Ganesh Shetty',
    age: 35,
    gender: 'Female',
    group: 'Group 3',
    skills: ['Banana Cultivation Assistance'],
    availability: true,
    contact: {
      phone: '9333466406',
      email: 'ganesh.shetty@example.com'
    },
    rating: 4.1,
    languages: ['Kannada'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  // Group 4
  {
    id: '34',
    name: 'Anitha Naik',
    age: 23,
    gender: 'Female',
    group: 'Group 4',
    skills: ['Arecanut Medicine Spray'],
    availability: false,
    contact: {
      phone: '9169248974',
      email: 'anitha.naik@example.com'
    },
    rating: 4.1,
    languages: ['Kannada', 'English'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '35',
    name: 'Rajesh Bhat',
    age: 35,
    gender: 'Male',
    group: 'Group 4',
    skills: ['Arecanut Harvesting'],
    availability: false,
    contact: {
      phone: '9517977918',
      email: 'rajesh.bhat@example.com'
    },
    rating: 4.9,
    languages: ['Kannada'],
    location: 'Sullia',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '36',
    name: 'Anitha Shenoy',
    age: 37,
    gender: 'Female',
    group: 'Group 4',
    skills: ['Arecanut Medicine Spray'],
    availability: false,
    contact: {
      phone: '9136582189',
      email: 'anitha.shenoy@example.com'
    },
    rating: 3.4,
    languages: ['Kannada'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '37',
    name: 'Anitha Kumar',
    age: 44,
    gender: 'Female',
    group: 'Group 4',
    skills: ['Banana Cultivation Assistance'],
    availability: false,
    contact: {
      phone: '9203769287',
      email: 'anitha.kumar@example.com'
    },
    rating: 4.8,
    languages: ['Kannada', 'English'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '38',
    name: 'Kavitha Acharya',
    age: 27,
    gender: 'Male',
    group: 'Group 4',
    skills: ['General Farm Labor'],
    availability: true,
    contact: {
      phone: '9202377449',
      email: 'kavitha.acharya@example.com'
    },
    rating: 4.7,
    languages: ['Kannada', 'English'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '39',
    name: 'Rajesh Pai',
    age: 42,
    gender: 'Female',
    group: 'Group 4',
    skills: ['Coconut Harvesting'],
    availability: true,
    contact: {
      phone: '9668712294',
      email: 'rajesh.pai@example.com'
    },
    rating: 3.8,
    languages: ['Kannada'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '40',
    name: 'Prakash Hegde',
    age: 27,
    gender: 'Male',
    group: 'Group 4',
    skills: ['Coconut Harvesting'],
    availability: true,
    contact: {
      phone: '9768156322',
      email: 'prakash.hegde@example.com'
    },
    rating: 4.5,
    languages: ['Kannada', 'English'],
    location: 'Sullia',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '41',
    name: 'Vijay Hegde',
    age: 45,
    gender: 'Female',
    group: 'Group 4',
    skills: ['Arecanut Medicine Spray'],
    availability: true,
    contact: {
      phone: '9214017170',
      email: 'vijay.hegde@example.com'
    },
    rating: 4.9,
    languages: ['Kannada', 'English'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '42',
    name: 'Radha Bhat',
    age: 50,
    gender: 'Male',
    group: 'Group 4',
    skills: ['Pepper Vine Support Work'],
    availability: true,
    contact: {
      phone: '9863615591',
      email: 'radha.bhat@example.com'
    },
    rating: 3.2,
    languages: ['Kannada'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '43',
    name: 'Shobha Shenoy',
    age: 38,
    gender: 'Female',
    group: 'Group 4',
    skills: ['Pepper Vine Support Work'],
    availability: false,
    contact: {
      phone: '9885506322',
      email: 'shobha.shenoy@example.com'
    },
    rating: 3.1,
    languages: ['Kannada'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '44',
    name: 'Vijay Shetty',
    age: 49,
    gender: 'Female',
    group: 'Group 4',
    skills: ['Arecanut Harvesting'],
    availability: false,
    contact: {
      phone: '9586506322',
      email: 'vijay.shetty@example.com'
    },
    rating: 3.5,
    languages: ['Kannada'],
    location: 'Bantwal',
    profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  // Group 5
  {
    id: '45',
    name: 'Harish Poojary',
    age: 41,
    gender: 'Female',
    group: 'Group 5',
    skills: ['Arecanut Medicine Spray'],
    availability: false,
    contact: {
      phone: '9942367434',
      email: 'harish.poojary@example.com'
    },
    rating: 3.4,
    languages: ['Kannada'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '46',
    name: 'Kavitha Pai',
    age: 25,
    gender: 'Male',
    group: 'Group 5',
    skills: ['Coconut Harvesting'],
    availability: true,
    contact: {
      phone: '9348283315',
      email: 'kavitha.pai@example.com'
    },
    rating: 4.1,
    languages: ['Kannada', 'English'],
    location: 'Bantwal',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '47',
    name: 'Meena Shenoy',
    age: 28,
    gender: 'Male',
    group: 'Group 5',
    skills: ['Banana Cultivation Assistance'],
    availability: false,
    contact: {
      phone: '9836509055',
      email: 'meena.shenoy@example.com'
    },
    rating: 4.3,
    languages: ['Kannada'],
    location: 'Bantwal',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '48',
    name: 'Vijay Poojary',
    age: 50,
    gender: 'Female',
    group: 'Group 5',
    skills: ['Coconut Harvesting'],
    availability: false,
    contact: {
      phone: '9278476333',
      email: 'vijay.poojary@example.com'
    },
    rating: 3.9,
    languages: ['Kannada', 'English'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '49',
    name: 'Shobha Rao',
    age: 50,
    gender: 'Female',
    group: 'Group 5',
    skills: ['Arecanut Medicine Spray'],
    availability: true,
    contact: {
      phone: '9926248588',
      email: 'shobha.rao@example.com'
    },
    rating: 3.6,
    languages: ['Kannada', 'English'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '50',
    name: 'Harish Rao',
    age: 22,
    gender: 'Female',
    group: 'Group 5',
    skills: ['Pepper Vine Support Work'],
    availability: false,
    contact: {
      phone: '9216225844',
      email: 'harish.rao@example.com'
    },
    rating: 4.6,
    languages: ['Kannada'],
    location: 'Puttur',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '51',
    name: 'Ganesh Shetty',
    age: 47,
    gender: 'Female',
    group: 'Group 5',
    skills: ['Coconut Harvesting'],
    availability: false,
    contact: {
      phone: '9597474227',
      email: 'ganesh.shetty@example.com'
    },
    rating: 4.6,
    languages: ['Kannada'],
    location: 'Bantwal',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '52',
    name: 'Savitha Kumar',
    age: 22,
    gender: 'Male',
    group: 'Group 5',
    skills: ['Banana Cultivation Assistance', 'Arecanut Harvesting'],
    availability: false,
    contact: {
      phone: '9372111652',
      email: 'savitha.kumar@example.com'
    },
    rating: 4.1,
    languages: ['Kannada'],
    location: 'Mangalore',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '53',
    name: 'Suresh Rao',
    age: 45,
    gender: 'Female',
    group: 'Group 5',
    skills: ['Coconut Harvesting', 'Arecanut Harvesting'],
    availability: false,
    contact: {
      phone: '9184667057',
      email: 'suresh.rao@example.com'
    },
    rating: 3.9,
    languages: ['Kannada', 'English'],
    location: 'Bantwal',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '54',
    name: 'Ganesh Hegde',
    age: 42,
    gender: 'Male',
    group: 'Group 5',
    skills: ['Banana Cultivation Assistance'],
    availability: true,
    contact: {
      phone: '9395389781',
      email: 'ganesh.hegde@example.com'
    },
    rating: 3.5,
    languages: ['Kannada'],
    location: 'Belthangady',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '55',
    name: 'Ravi Kumar',
    age: 35,
    gender: 'Male',
    group: 'Group 5',
    skills: ['General Farm Labor', 'Arecanut Harvesting'],
    availability: true,
    contact: {
      phone: '9196808725',
      email: 'ravi.kumar@example.com'
    },
    rating: 3.8,
    languages: ['Kannada', 'English'],
    location: 'Sullia',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
]

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Arecanut Harvesting - North Field',
    type: 'Arecanut Harvesting',
    date: '2024-01-15',
    workersNeeded: 8,
    assignedWorkers: ['1', '2', '3'],
    status: 'approved',
    location: 'North Field - Puttur',
    duration: '6 hours',
    description: 'Harvest mature arecanuts from the north field section',
    createdBy: 'employer',
    createdAt: '2024-01-10T10:30:00Z'
  },
  {
    id: '2',
    title: 'Medicine Spray Application',
    type: 'Arecanut Medicine Spray',
    date: '2024-01-16',
    workersNeeded: 4,
    assignedWorkers: ['4', '5'],
    status: 'pending',
    location: 'South Field - Belthangady',
    duration: '4 hours',
    description: 'Apply pest control medicine to arecanut trees',
    createdBy: 'employer',
    createdAt: '2024-01-12T14:20:00Z'
  },
  {
    id: '3',
    title: 'Coconut Harvesting - West Section',
    type: 'Coconut Harvesting',
    date: '2024-01-18',
    workersNeeded: 6,
    assignedWorkers: ['6', '7', '8', '9'],
    status: 'approved',
    location: 'West Section - Mangalore',
    duration: '5 hours',
    description: 'Harvest coconuts from tall trees in west section',
    createdBy: 'employer',
    createdAt: '2024-01-13T09:15:00Z'
  }
]

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    taskId: '1',
    workerId: '2',
    workerName: 'Ramesh Shenoy',
    rating: 4,
    comment: 'Good work environment and fair wages. Task was well organized.',
    createdAt: '2024-01-15T18:30:00Z'
  },
  {
    id: '2',
    taskId: '1',
    workerId: '3',
    workerName: 'Meena Acharya',
    rating: 5,
    comment: 'Excellent coordination from supervisor. Clear instructions provided.',
    createdAt: '2024-01-15T19:00:00Z'
  },
  {
    id: '3',
    taskId: '3',
    workerId: '6',
    workerName: 'Umesh Naik',
    rating: 3,
    comment: 'Task was okay but could use better safety equipment.',
    createdAt: '2024-01-18T17:45:00Z'
  },
  {
    id: '4',
    taskId: '3',
    workerId: '7',
    workerName: 'Ramesh Poojary',
    rating: 4,
    comment: 'Good experience overall. Payment was on time.',
    createdAt: '2024-01-18T18:15:00Z'
  }
]

export const mockEmployerFeedback: EmployerFeedback[] = [
  {
    id: '1',
    subject: 'Worker Performance in North Field',
    comment: 'The workers in Group 1 have been performing exceptionally well in the arecanut harvesting. Their efficiency has improved by 20% compared to last month.',
    category: 'Workers',
    priority: 'Medium',
    employerName: 'Rajesh Kumar',
    createdAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    subject: 'Safety Equipment Requirements',
    comment: 'Need to provide better safety harnesses for coconut tree climbing workers. Current equipment is showing signs of wear and tear.',
    category: 'Safety',
    priority: 'High',
    employerName: 'Rajesh Kumar',
    createdAt: '2024-01-19T14:20:00Z'
  },
  {
    id: '3',
    subject: 'Task Scheduling Optimization',
    comment: 'Medicine spray tasks should be scheduled in the early morning to avoid strong winds. Current afternoon scheduling is causing uneven application.',
    category: 'Tasks',
    priority: 'Medium',
    employerName: 'Priya Sharma',
    createdAt: '2024-01-18T09:15:00Z'
  },
  {
    id: '4',
    subject: 'Worker Training Program',
    comment: 'The new workers from Group 5 need additional training on proper harvesting techniques. Quality of arecanuts has decreased slightly.',
    category: 'Performance',
    priority: 'High',
    employerName: 'Rajesh Kumar',
    createdAt: '2024-01-17T16:45:00Z'
  },
  {
    id: '5',
    subject: 'Weather Impact on Work',
    comment: 'Recent rains have affected the drying process of harvested arecanuts. Need to arrange covered storage areas for better quality control.',
    category: 'General',
    priority: 'Medium',
    employerName: 'Priya Sharma',
    createdAt: '2024-01-16T11:30:00Z'
  }
]

// Helper functions for mock data
export const getWorkersByGroup = (groupName: string) => {
  return mockWorkers.filter(worker => worker.group === groupName)
}

export const getAvailableWorkers = () => {
  return mockWorkers.filter(worker => worker.availability)
}

export const getWorkersBySkill = (skill: string) => {
  return mockWorkers.filter(worker => worker.skills.includes(skill))
}

export const getFeedbackByTask = (taskId: string) => {
  return mockFeedback.filter(feedback => feedback.taskId === taskId)
}

console.log('📊 Enhanced mock data loaded - Workers:', mockWorkers.length, 'Tasks:', mockTasks.length, 'Feedback:', mockFeedback.length)