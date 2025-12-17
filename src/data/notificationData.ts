
import { NotificationEvent } from '@/types/notification';

export const notificationEvents: NotificationEvent[] = [
  {
    id: 'class-reminder',
    name: 'Class Reminder',
    description: 'Reminder sent before scheduled classes',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'instructor'],
      reminderTimes: [1440, 120, 30], // 24 hours, 2 hours, 30 minutes
      sendToSupport: false,
      subject: 'Class Reminder - [course_name]',
      messageBody: 'Hi [first_name], your class "[course_name]" is scheduled for [date] at [time]. Please join on time.'
    },
    whatsappConfig: {
      receivers: ['learner', 'instructor'],
      reminderTimes: [120, 30],
      sendToSupport: false,
      messageBody: 'Hi [first_name], your class "[course_name]" is scheduled for [date] at [time]. Please join on time.'
    }
  },
  {
    id: 'class-cancellation',
    name: 'Class Cancellation',
    description: 'Notification when a class is cancelled',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'instructor', 'parent'],
      reminderTimes: [0],
      sendToSupport: true,
      subject: 'Class Cancelled - [course_name]',
      messageBody: 'Hi [first_name], your class "[course_name]" scheduled for [date] at [time] has been cancelled. Please check [site_url] for updates.'
    },
    whatsappConfig: {
      receivers: ['learner', 'instructor', 'parent'],
      reminderTimes: [0],
      sendToSupport: true,
      messageBody: 'Hi [first_name], your class "[course_name]" scheduled for [date] at [time] has been cancelled.'
    }
  },
  {
    id: 'class-rescheduled',
    name: 'Class Rescheduled',
    description: 'Notification when a class is rescheduled',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'instructor', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      subject: 'Class Rescheduled - [course_name]',
      messageBody: 'Hi [first_name], your class "[course_name]" has been rescheduled to [date] at [time]. Please update your calendar.'
    },
    whatsappConfig: {
      receivers: ['learner', 'instructor', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      messageBody: 'Hi [first_name], your class "[course_name]" has been rescheduled to [date] at [time].'
    }
  },
  {
    id: 'assessment-submission',
    name: 'Assessment Submission',
    description: 'Notification when assessment is submitted',
    emailEnabled: true,
    whatsappEnabled: false,
    emailConfig: {
      receivers: ['instructor', 'support'],
      reminderTimes: [0],
      sendToSupport: true,
      subject: 'Assessment Submitted - [course_name]',
      messageBody: 'A new assessment has been submitted by [first_name] for [course_name]. Please review at [site_url].'
    },
    whatsappConfig: {
      receivers: [],
      reminderTimes: [],
      sendToSupport: false,
      messageBody: ''
    }
  },
  {
    id: 'assessment-evaluation',
    name: 'Assessment Evaluation',
    description: 'Notification when assessment is evaluated',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      subject: 'Assessment Evaluated - [course_name]',
      messageBody: 'Hi [first_name], your assessment for [course_name] has been evaluated. Check your results at [site_url].'
    },
    whatsappConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      messageBody: 'Hi [first_name], your assessment for [course_name] has been evaluated. Check your results!'
    }
  },
  {
    id: 'certificate-generation',
    name: 'Certificate Generation',
    description: 'Notification when certificate is generated',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      subject: 'Certificate Ready - [course_name]',
      messageBody: 'Congratulations [first_name]! Your certificate for [course_name] is ready. Download it from [site_url].'
    },
    whatsappConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      messageBody: 'Congratulations [first_name]! Your certificate for [course_name] is ready for download.'
    }
  },
  {
    id: 'demo-class-guest',
    name: 'Demo Class for Guest',
    description: 'Demo class booking confirmation for guests',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['guest'],
      reminderTimes: [1440, 60],
      sendToSupport: true,
      subject: 'Demo Class Scheduled - [course_name]',
      messageBody: 'Hi [first_name], your demo class for [course_name] is scheduled for [date] at [time]. Join us at [site_url].'
    },
    whatsappConfig: {
      receivers: ['guest'],
      reminderTimes: [60],
      sendToSupport: false,
      messageBody: 'Hi [first_name], your demo class for [course_name] is scheduled for [date] at [time].'
    }
  },
  {
    id: 'course-expiry-reminder',
    name: 'Course Expiry Reminder',
    description: 'Reminder before course expires',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [10080, 1440], // 7 days, 1 day
      sendToSupport: false,
      subject: 'Course Expiring Soon - [course_name]',
      messageBody: 'Hi [first_name], your course [course_name] will expire on [date]. Please renew to continue learning.'
    },
    whatsappConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [1440],
      sendToSupport: false,
      messageBody: 'Hi [first_name], your course [course_name] will expire on [date]. Please renew to continue.'
    }
  },
  {
    id: 'course-assignment',
    name: 'Course Assignment',
    description: 'Notification when course is assigned',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      subject: 'New Course Assigned - [course_name]',
      messageBody: 'Hi [first_name], you have been assigned to [course_name]. Start learning at [site_url].'
    },
    whatsappConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      messageBody: 'Hi [first_name], you have been assigned to [course_name]. Start learning now!'
    }
  },
  {
    id: 'feedback-submission',
    name: 'Feedback Submission',
    description: 'Notification when feedback is submitted',
    emailEnabled: true,
    whatsappEnabled: false,
    emailConfig: {
      receivers: ['instructor', 'support'],
      reminderTimes: [0],
      sendToSupport: true,
      subject: 'New Feedback Received - [course_name]',
      messageBody: 'New feedback has been submitted by [first_name] for [course_name]. Review at [site_url].'
    },
    whatsappConfig: {
      receivers: [],
      reminderTimes: [],
      sendToSupport: false,
      messageBody: ''
    }
  },
  {
    id: 'class-completion',
    name: 'Class Completion',
    description: 'Notification when class is completed',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'parent', 'instructor'],
      reminderTimes: [0],
      sendToSupport: false,
      subject: 'Class Completed - [course_name]',
      messageBody: 'Hi [first_name], you have successfully completed your class for [course_name]. Keep up the great work!'
    },
    whatsappConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      messageBody: 'Hi [first_name], you have completed your class for [course_name]. Great job!'
    }
  },
  {
    id: 'instructor-replacement',
    name: 'Instructor Replacement',
    description: 'Notification when instructor is replaced',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: true,
      subject: 'Instructor Change - [course_name]',
      messageBody: 'Hi [first_name], there has been an instructor change for your [course_name] class scheduled on [date] at [time].'
    },
    whatsappConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      messageBody: 'Hi [first_name], there has been an instructor change for your [course_name] class on [date].'
    }
  },
  {
    id: 'exam-scheduled',
    name: 'Exam Scheduled',
    description: 'Notification when exam is scheduled',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [10080, 1440, 60], // 7 days, 1 day, 1 hour
      sendToSupport: false,
      subject: 'Exam Scheduled - [course_name]',
      messageBody: 'Hi [first_name], your exam for [course_name] is scheduled for [date] at [time]. Prepare well!'
    },
    whatsappConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [1440, 60],
      sendToSupport: false,
      messageBody: 'Hi [first_name], your exam for [course_name] is scheduled for [date] at [time].'
    }
  },
  {
    id: 'result-published',
    name: 'Result Published',
    description: 'Notification when exam results are published',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      subject: 'Results Published - [course_name]',
      messageBody: 'Hi [first_name], your exam results for [course_name] have been published. Check them at [site_url].'
    },
    whatsappConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      messageBody: 'Hi [first_name], your exam results for [course_name] are now available!'
    }
  },
  {
    id: 'progress-report-shared',
    name: 'Progress Report Shared',
    description: 'Notification when progress report is shared',
    emailEnabled: true,
    whatsappEnabled: true,
    emailConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      subject: 'Progress Report Available - [course_name]',
      messageBody: 'Hi [first_name], your progress report for [course_name] is now available. View it at [site_url].'
    },
    whatsappConfig: {
      receivers: ['learner', 'parent'],
      reminderTimes: [0],
      sendToSupport: false,
      messageBody: 'Hi [first_name], your progress report for [course_name] is now available!'
    }
  }
];
