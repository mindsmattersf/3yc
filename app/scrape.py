import time
from datetime import datetime

from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

from config import config


SOPHOMORE_FOLDER_ID = '0BxjpiLB4DbPmOUVXN3FiS05FcnM'
JUNIOR_FOLDER_ID = '0B-r-l0myZwJtREc1dml4R2dPTDA'


def list_folder(drive, parent):
    filelist = []
    file_list = drive.ListFile({'q': "'%s' in parents and trashed=false" % parent}).GetList()

    for f in file_list:
        if f['mimeType'] == 'application/vnd.google-apps.folder': # if folder
            continue
        else:
            filelist.append(f)
    return filelist


def parse_description(description):
    tags = []
    already_inserted = {}
    for line in description.strip().split('3YC'):
        if not line:
            continue
        _, learning_objective, sub_learning_objective, class_year, activity = map(lambda s: s.strip(), line.split('/'))

        if sub_learning_objective in already_inserted:
            continue

        tags.append({
            'learning_objective': learning_objective,
            'sub_learning_objective': sub_learning_objective,
            'class_year': class_year,
            'activity': activity
        })

        already_inserted[sub_learning_objective] = None

    return list(sorted(tags, key=lambda x: (x['learning_objective'], x['sub_learning_objective'])))


def parse_owner(owners):
    owner = owners[0]
    return dict(
        name=owner['displayName'],
        email=owner['emailAddress'],
        picture=owner['picture']['url']
    )


def parse_last_modified(obj):
    last_modifying_user = obj['lastModifyingUser']
    return dict(
        date=datetime.strptime(obj['modifiedDate'], "%Y-%m-%dT%H:%M:%S.%fZ").strftime('%Y-%m-%d'),
        user=dict(
            name=last_modifying_user['displayName'],
            email=last_modifying_user['emailAddress'],
            picture=last_modifying_user['picture']['url']
        )
    )


def parse_thumbnail(link, image_height=700):
    return link.replace('sz=s220', 'sz=s%s' % image_height)


def parse_title(title):
    klass, week, title = map(lambda s: s.strip(), title.replace(':', '-').split('-'))
    week = int(week.lower().replace('week', ''))
    klass, graduation_year = klass.split()
    graduation_year = int("20" + graduation_year.replace("'", ''))
    return week, klass, graduation_year, title


def process_files(files):
    lines = []
    for file_ in files:
        # this is a really janky way of filtering for lessons. BAsically if a
        # description exists then its a lesson otherwise skip over the file.
        if 'description' not in file_ or not file_['description'].strip():
            continue

        tags = parse_description(file_['description'])
        owner = parse_owner(file_['owners'])
        last_modified = parse_last_modified(file_)
        thumbnail= parse_thumbnail(file_['thumbnailLink'])
        try:
            week, klass, graduation_year, title = parse_title(file_['title'])
        except ValueError:
            print(file_['title'])
            continue

        lines.append({
            'google_drive_id': file_['id'],
            'title': title,
            'week': week,
            'className': klass,
            'graduation_year': graduation_year,
            'link': file_['alternateLink'],
            'description': None,
            'tags': tags,
            'created': datetime.strptime(file_['createdDate'], "%Y-%m-%dT%H:%M:%S.%fZ").strftime('%Y-%m-%d'),
            'owner': owner,
            'last_modified': last_modified,
            'thumbnail': thumbnail,
        })

    return list(sorted(lines, key=lambda x: (x['graduation_year'], x['className'], x['week'])))


class MemoizedTtl(object):
    """Decorator that caches a function's return value each time it is called within a TTL
    If called within the TTL and the same arguments, the cached value is returned,
    If called outside the TTL or a different value, a fresh value is returned.
    http://jonebird.com/2012/02/07/python-memoize-decorator-with-ttl-argument/
    """
    def __init__(self, ttl):
        self.cache = {}
        self.ttl = ttl
    def __call__(self, f):
        def wrapped_f(*args):
            now = time.time()
            try:
                value, last_update = self.cache[args]
                if self.ttl > 0 and now - last_update > self.ttl:
                    raise AttributeError
                #print 'DEBUG: cached value'
                return value
            except (KeyError, AttributeError):
                value = f(*args)
                self.cache[args] = (value, now)
                #print 'DEBUG: fresh value'
                return value
            except TypeError:
                # uncachable -- for instance, passing a list as an argument.
                # Better to not cache than to blow up entirely.
                return f(*args)
        return wrapped_f


memoized_ttl = MemoizedTtl


@memoized_ttl(config.GDRIVE_CACHE_TIME_IN_SECONDS)
def scrape_drive():
    gauth = GoogleAuth()
    drive = GoogleDrive(gauth)
    sophomore_files = list_folder(drive, SOPHOMORE_FOLDER_ID)
    junior_files = list_folder(drive, JUNIOR_FOLDER_ID)
    # return process_files(sophomore_files)
    return process_files(sophomore_files + junior_files)
