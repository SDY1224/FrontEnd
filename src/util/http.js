import axios from 'axios'
import authentication from 'react-azure-adb2c'

/**
 * Set up http
 */
const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
})


/**
 * api 
 * - Object for http requests from backend
 */
export const api = {
  initialData: require('./json/initialData.json'),
  offeringAccessType: require('./json/offeringAccessTypes.json'),
  playlistTypes: require('./json/playlistTypes.json'),

  /**
   * Function called when all the requests executed
   * then hide the loading page
   */
  contentLoaded: function (interval) {
    const ele = document.getElementById('ct-loading-wrapper')
    if(ele) {
      // fade out
      ele.classList.add('available')
      setTimeout(() => {
        // remove from DOM
        ele.outerHTML = ''
        // ele.classList.add('hide')
      }, interval || 500)
    }
  },

  /**
   * Functions for set or get the auth/b2c token
   */
  b2cToken: () => authentication.getAccessToken(),
  authToken: () => localStorage.getItem('authToken'),
  getAuthToken: function() {
    return http.post('https://sysprog.ncsa.illinois.edu:4443/Account/SignIn', {"b2cToken": this.b2cToken()})
  },
  saveAuthToken: function (responce) {
    localStorage.setItem('authToken', responce.data.authToken)
  },

  /********************* Functions for http requests *********************/

  /**
   * GET
   */
  getData: function (path, id) {
    path = id ? `${path}/${id}` : path
    return http.get(path)
  },
  /**
   * GET an array of pathes
   * callBack = (responce, stateName) => {this.setState({[stateName]: responce.data})}
   */ 
  getAll: function (value, callBack, handleError) {
    var array = []
    if (typeof value === 'string') { array.push(value) } 
    else { array = value }
    
    for (var i = 0; i < array.length; i++) {
      const path = array[i]
      const stateName = path.toLowerCase()
      this.getData(path)
        .then(responce => {
          if (callBack) callBack(responce, stateName)
        })
        .catch( error => {
          console.log(error) 
          if (handleError) handleError();
        })
    }
  },
  /**
   * Some specific get-by-id functions
   */
  getUniversityById: function (id) {
    return this.getData('Universities', id)
  },
  getDepartsByUniId: function (id) {
    return this.getData('Departments/ByUniversity', id)
  },
  getCoursesByDepartId: function (id) {
    return this.getData('Courses/ByDepartment', id) 
  },
  getTermsByUniId: function (id) {
    return this.getData('Terms/ByUniversity', id) 
  },
  getCoursesByInstId: function (id) {
    return this.getData('Courses/ByInstructor', id) 
  },
  getCourseOfferingsByInstructorId: function (id) {
    return this.getData('CourseOfferings/ByInstructor', id)
  },
  getOfferingsByStudentId: function(id) {
    return this.getData('Offerings/ByStudent', id)
  },

  completeSingleOffering: function(rawOffering, index, currOfferings, setOffering) {
    // get courseOffering by offering id
    this.getData('Offerings', rawOffering.id)
    .then(response => {
      const courseOffering = response.data
      // set id for future use
      courseOffering.id = courseOffering.offering.id
      // get department acronym
      courseOffering.courses.forEach( course => {
        this.getData('Departments', course.departmentId) 
          .then( ({data}) => {
            course.acronym = data.acronym
            currOfferings[index] = courseOffering
            setOffering(currOfferings)
          })
      })
      // get term name
      this.getData('Terms', courseOffering.offering.termId)
        .then(({data}) => {
          courseOffering.offering.termName = data.name
          currOfferings[index] = courseOffering
          setOffering(currOfferings)
        })
    })
  },
  completeOfferings: function(rawOfferings, currOfferings, setOffering) {
    // rawOfferings = handleData.shuffle(rawOfferings)
    rawOfferings.forEach( (offering, index) => {
      this.completeSingleOffering(offering, index, currOfferings, setOffering)
    })
  },
  getFullNumber: function(courses) {
    var name = ''
    courses.forEach( course => {
      name += course.acronym + course.courseNumber + '/';
    })
    name = name.slice(0, name.length - 1)
    return name
  },

  /**
   * POST
   * callBack = responce => {...}
   */
  postData: function (path, data, callBack) {
    if (callBack) 
      return http.post(path, data)
        .then(responce => callBack(responce))
    else 
      return http.post(path, data)
  },
  postToCourseOfferings: function (data) {
    return this.postData('CourseOfferings', data)
  },
  postOfferingAddInstructors: function (offeringId, data) {
    return this.postData(`Offerings/AddUsers/${offeringId}/Instructor`, data)
  },
  /**
   * PUT
   * callBack = responce => {...}
   */
  updateData: function (path, data, callBack) {
    if (callBack) 
      return http.put(`${path}/${data.id}`, data)
        .then(responce => callBack(responce))
    else 
      return http.put(`${path}/${data.id}`, data)
  },
  /**
   * DELETE
   * callBack = responce => {...}
   */
  deleteData: function (path, id, callBack) {
    if (callBack)
      return http.delete(`${path}/${id}`)
        .then(responce => callBack(responce))
    else 
      return http.delete(`${path}/${id}`)
  },
  deleteFromCourseOfferings: function (courseId, offeringId) {
    return http.delete(`CourseOfferings/${courseId}/${offeringId}`)
  },
  deleteUserFromOffering: function(offeringId, userId) {
    return this.deleteData(`UserOfferings/${offeringId}/${userId}`)
  }

}