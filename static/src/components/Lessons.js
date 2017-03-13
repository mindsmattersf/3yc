import React from 'react';
import Highlight from 'react-highlighter';
import Moment from 'moment'
import Thumbnail from './Thumbnail';


const Lessons = ({lesson_plans, textHighlight}) => {
  var lesson_plans = lesson_plans.map(function(lesson, index) {
    return (
      <div key={index}>
        <div className="media lesson-item">
          <div className="media-left col-md-3">
            <b>{lesson.className}</b>
            ({lesson.graduation_year})<br />
            Week {lesson.week}
          </div>
          <div className="media-body col-md-9">
            <h4>
              <a href={lesson.link} className="deco-none" target="_blank">
                <Highlight matchElement="mark" search={textHighlight}>{lesson.title}</Highlight>
              </a>
            </h4>

            <Thumbnail url={lesson.thumbnail} />

            {lesson.tags.map(function(tag, j) {
              const styles = {
                Discovery: "tag-primary",
                Planning: "tag-success",
                Readiness: "tag-warning"
              }

              const style = "tag " + styles[tag.learning_objective]

              return <span className={style} key={j}>{tag.sub_learning_objective}</span>
            })}

            <p>
              <Highlight matchElement="mark" search={textHighlight}>
                {lesson.description}
              </Highlight>
            </p>

            <p className="diminished-text">Created by &nbsp;
              <img className="profile-picture" src={lesson.owner.picture} />
              &nbsp;
              <a href={"mailto:" + lesson.owner.email}>{lesson.owner.name}</a>
              &nbsp;
              on {Moment(lesson.created).format('LL')}&nbsp;
              | Updated {Moment(lesson.last_modified.date).fromNow()}
            </p>
          </div>
        </div>
      </div>
    )
  });
  return (
    <div>
      {lesson_plans}
    </div>
  )
}


export default Lessons
