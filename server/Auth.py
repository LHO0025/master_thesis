import jwt
import datetime

class Auth:
    def __init__(self, secret, users):
        self.secret = secret
        self.users = users

    def generate_token(self, username):
        payload = {
            "username": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Expires in 1 hour
        }
        return jwt.encode(payload, self.secret, algorithm="HS256")
    
    def validate_token(self, token):
        try:
            return jwt.decode(token, self.secret, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise jwt.ExpiredSignatureError
        except jwt.InvalidTokenError:
            raise jwt.InvalidTokenError
        
    def validate_credentials(self, username, password):
        if username in self.users and self.users[username] == password:
            return True
        return False

