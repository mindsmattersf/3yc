import React from 'react';
import axios from 'axios';
import _ from "underscore"
import Lessons from './Lessons'
import ClassYearButton from './ClassYearButton'
import SubLearningObjective from './SubLearningObjective'


class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      initialLessons: [],
      lessons: [],
      classYearsIsActive: {
        Sophomore: false,
        Junior: false,
        Senior: false
      },
      tagsActive: [],
      textHighlight: ""
    }
  }

  componentDidMount() {
    axios.get("/api/lessons.json")
      .then((response) => {
        const lessons = response.data;
        this.setState({initialLessons: lessons, lessons: lessons });
      });
  }

  _getLessons(tagsActive, classYearsIsActive) {
    var lessons = this.state.initialLessons

    if (tagsActive) {
      for (var i = 0; i < tagsActive.length; i++) {
        lessons = lessons.filter(function(lesson) {
          var lessonTags = lesson["tags"].map(function(tag) {
            return tag["sub_learning_objective"]
          })
          return _.intersection(lessonTags, tagsActive).length == tagsActive.length
        })
      }
    }


    var yearActive = Object.keys(classYearsIsActive).filter(function(x) {
      return classYearsIsActive[x]
    });

    if (yearActive.length > 0) {

      lessons = lessons.filter(function(lesson) {
        return yearActive.indexOf(lesson.className) >= 0
      })
    }

    return lessons;
  }

  _addTag (tag) {
    var tagsActive = this.state.tagsActive.slice()
    if (tagsActive.indexOf(tag) === -1) {
      tagsActive.push(tag);
    }

    // console.log("before:", this.state.tagsActive)
    // console.log("adding:", tag)
    // console.log("after:", tagsActive)
    var lessons = this._getLessons(tagsActive, this.state.classYearsIsActive)
    this.setState({
      tagsActive: tagsActive,
      lessons: lessons
    })

  }

  _removeTag (tag) {
    var tagsActive = this.state.tagsActive.slice()
    var index = tagsActive.indexOf(tag);
    if (index > -1) {
      tagsActive.splice(index, 1)
      var lessons = this._getLessons(tagsActive, this.state.classYearsIsActive)
      this.setState({
        tagsActive: tagsActive,
        lessons: lessons
      })
    }
  }

  _addClassYear (classYear) {
    var classYearsIsActive = JSON.parse(JSON.stringify(this.state.classYearsIsActive));

    classYearsIsActive[classYear] = true;

    var lessons = this._getLessons(this.state.tagsActive, classYearsIsActive)
    this.setState({
      classYearsIsActive: classYearsIsActive,
      lessons: lessons
    })
  }
  _removeClassYear (classYear) {
    var classYearsIsActive = JSON.parse(JSON.stringify(this.state.classYearsIsActive));
    classYearsIsActive[classYear] = false;

    var lessons = this._getLessons(this.state.tagsActive, classYearsIsActive)
    this.setState({
      classYearsIsActive: classYearsIsActive,
      lessons: lessons
    })
  }

  _changeText (e) {
    var text = e.target.value.toLowerCase().trim();
    var lessons = this._getLessons(this.state.tagsActive, this.state.classYearsIsActive)

    if (text) {
      lessons = lessons.filter(function(row) {
        var s = (row["title"] + row["tags"][0]["sub_learning_objective"] + row["description"]).toLowerCase()
        return s.indexOf(text) > 1
      })
    }

    this.setState({
      lessons: lessons,
      textHighlight: text ? text : null
    });
  }

  render () {


    return (
      <div className="container">
        <div className="page-header">
          <div className="input-group input-group-lg">
            <input type="text" className="form-control" placeholder="Find lessons for..." onChange={this._changeText.bind(this)} />
            <span className="input-group-btn">
              <button className="btn btn-secondary" type="button">
                <span className="fa fa-search" aria-hidden="true"></span>
              </button>
            </span>
          </div>

          <div className="tag-group text-center">
            <ClassYearButton classYear="Sophomore" addClassYear={this._addClassYear.bind(this)} removeClassYear={this._removeClassYear.bind(this)}/>
            <ClassYearButton classYear="Junior" addClassYear={this._addClassYear.bind(this)} removeClassYear={this._removeClassYear.bind(this)}/>
            <ClassYearButton classYear="Senior" addClassYear={this._addClassYear.bind(this)} removeClassYear={this._removeClassYear.bind(this)}/>
          </div>

          <div className=" tag-group text-center button-wrapper">
            <SubLearningObjective learningObjective="Discovery" subLearningObjective="Self Determination"   addTag={this._addTag.bind(this)} removeTag={this._removeTag.bind(this)}  />
            <SubLearningObjective learningObjective="Discovery" subLearningObjective="Self Expression"  addTag={this._addTag.bind(this)} removeTag={this._removeTag.bind(this)}  />
            <SubLearningObjective learningObjective="Discovery" subLearningObjective="Self Knowledge"  addTag={this._addTag.bind(this)} removeTag={this._removeTag.bind(this)}  />
            <SubLearningObjective learningObjective="Planning" subLearningObjective="College"  addTag={this._addTag.bind(this)} removeTag={this._removeTag.bind(this)}  />
            <SubLearningObjective learningObjective="Planning" subLearningObjective="High School"  addTag={this._addTag.bind(this)} removeTag={this._removeTag.bind(this)}  />
            <SubLearningObjective learningObjective="Readiness" subLearningObjective="Academic"  addTag={this._addTag.bind(this)} removeTag={this._removeTag.bind(this)}  />
            <SubLearningObjective learningObjective="Readiness" subLearningObjective="Psychological"  addTag={this._addTag.bind(this)} removeTag={this._removeTag.bind(this)}  />
            <SubLearningObjective learningObjective="Readiness" subLearningObjective="Social"  addTag={this._addTag.bind(this)} removeTag={this._removeTag.bind(this)}  />
          </div>

        </div>

        <div>
          <p>
            {this.state.lessons.length == 0 ? "No lesson plans found." :
              (this.state.lessons.length == this.state.initialLessons.length ? "" : "Found " + this.state.lessons.length + " lesson plans:")
            }
          </p>
        </div>
        <Lessons lesson_plans={this.state.lessons} textHighlight={this.state.textHighlight} />
      </div>
    )
  }
}

export default Home;
