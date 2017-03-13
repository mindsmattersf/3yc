from flask import Flask

from config import basedir, config


def create_app():
    app = Flask(__name__, template_folder=config.TEMPLATE_FOLDER,
        static_folder=config.STATIC_FOLDER,
        static_url_path=config.STATIC_URL_PATH)

    app.config.from_object(config)

    from .app import app as app_blueprint
    app.register_blueprint(app_blueprint)


    return app
