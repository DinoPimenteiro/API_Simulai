import connection from "./dbConn.js";

class Loaders{
  static dbConn(){
    connection();
  }
}

export default Loaders;