import os

basedir = os.path.abspath(os.path.dirname(__file__))


class BaseConfig:

    SECRET_KEY = "SO_SECRET"
    DEBUG = True
    STATIC_FOLDER = os.path.join(basedir, 'static/')
    TEMPLATE_FOLDER = os.path.join(basedir, 'static/')
    STATIC_URL_PATH = "/static/"
    GDRIVE_CACHE_TIME_IN_SECONDS = 3600


class ProductionConfig(BaseConfig):

    SECRET_KEY = os.environ.get('MMSF-3YC-SECRET-KEY')
    DEBUG = False


config = BaseConfig()
