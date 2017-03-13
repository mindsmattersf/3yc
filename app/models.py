

# class Experiment(db.Model):
#     __tablename__ = 'experiments'
#     id = db.Column(db.Integer, primary_key=True)
#     merchant = db.Column(db.String(128), nullable=False)
#     launch_date = db.Column(db.Date(), default=date.today, nullable=False)
#     dp_revision = db.Column(db.String(128))
#     experiment_type = db.Column(db.String(128), nullable=False)
#     created_date = db.Column(db.DateTime(), default=datetime.now)
#     description = db.Column(db.Text)
#     debug_notes = db.Column(db.Text)
#     is_active = db.Column(db.Boolean, default=True)
#     overlap_launch_date = db.



class ClassYear(db.Model):
    pass

class LessonPlan(db.Model):
    __tablename__ = 'lessonplans'
    id = db.Column(db.Integer, primary_key=True)
    drive_id = db.Column(db.String(128))
    url = db.Column(db.String(256))
    # last_modified


class