
class Tables {

  init(connection) {
    this.connection = connection
    this.createTableReceive()
    this.createTableSalary()
    this.createTableWebscrapingHistory()
    this.createTableProsegurDistance()
    this.createTableInviolavelOffice()
    this.createTableProsegurOffice()
    this.createTableProsegurArrest()
    this.createTableProsegurPower()
    this.createTableProsegurMaintenance()
    this.createTableAddress()
    this.createTableContact()
    this.createTableOffice()
    this.createTableClient()
    this.createTableLogin()
    this.createTableUser()
    this.createTableHistory()
    this.createTableLabel()
    this.createTableItemGroup()
    this.createTableItem()
    this.createTableAddressClient()
    this.createTableContactClient()
    this.createTablePowerBI()
    this.createTableViewPowerBI()

    return true
  }

  createTableReceive() {
    const sql = `CREATE TABLE IF NOT EXISTS receive (id_receive int NOT NULL AUTO_INCREMENT, serNr double,
     SalesMan VARCHAR (250), nameSalesman VARCHAR (250), code int, client VARCHAR (250), CustomerGroup double, 
     TransDate DATE, Office int, Days VARCHAR (20), rowNr int, d15 double, d30 double, d60 double, d90 double, d120 double,
     dm120 double, Vencido double, ItemGroup int, DueDate DATE, Saldo double, itemDesc VARCHAR (250), total double, lastPay DATE,
     Currency varchar(8), totalCurrency double, status VARCHAR (20), totalUsd double, PRIMARY KEY (id_receive))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableSalary() {
    const sql = `CREATE TABLE IF NOT EXISTS salary (id_salary int NOT NULL AUTO_INCREMENT, serNr double, dateTime DATETIME, 
     comment VARCHAR (250), reference VARCHAR (250), usd double, office VARCHAR (5), name VARCHAR (250), PRIMARY KEY (id_salary))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableWebscrapingHistory() {
    const sql = `CREATE TABLE IF NOT EXISTS webscrapinghistory (id_webscraping int NOT NULL AUTO_INCREMENT, description VARCHAR(150) NOT NULL, dateReg DATETIME NOT NULL, PRIMARY KEY (id_webscraping))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableInviolavelOffice() {
    const sql = `CREATE TABLE IF NOT EXISTS inviolaveloffice (id_inviolaveloffice int NOT NULL AUTO_INCREMENT, title VARCHAR (150) NOT NULL, date DATETIME  NOT NULL, 
     office VARCHAR (100) NOT NULL, description VARCHAR (250) NOT NULL, PRIMARY KEY (id_inviolaveloffice))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableViewPowerBI() {
    const sql = `CREATE TABLE IF NOT EXISTS viewpowerbi (id_viewpowerbi int NOT NULL AUTO_INCREMENT, id_powerbi int NOT NULL, id_login int NOT NULL,
     dateReg DATETIME NOT NULL, PRIMARY KEY (id_viewpowerbi),  FOREIGN KEY (id_powerbi) REFERENCES powerbi (id_powerbi), 
     FOREIGN KEY (id_login) REFERENCES login (id_login))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTablePowerBI() {
    const sql = `CREATE TABLE IF NOT EXISTS powerbi (id_powerbi int NOT NULL AUTO_INCREMENT, url VARCHAR (1000) NOT NULL, title VARCHAR (50) NOT NULL,
    type int, token VARCHAR (250), idreport VARCHAR (100), dateReg DATETIME NOT NULL, PRIMARY KEY (id_powerbi))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableProsegurDistance() {
    const sql = `CREATE TABLE IF NOT EXISTS prosegurdistance (id_prosegurdistance int NOT NULL AUTO_INCREMENT, plate VARCHAR (10) NOT NULL, km double NOT NULL, dateReg DATETIME,
     PRIMARY KEY (id_prosegurdistance))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableProsegurOffice() {
    const sql = `CREATE TABLE IF NOT EXISTS proseguroffice (id_proseguroffice int NOT NULL AUTO_INCREMENT, dateTime DATETIME, codconnection VARCHAR (20), contract VARCHAR (25),
    description VARCHAR (250), PRIMARY KEY (id_proseguroffice))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableProsegurArrest() {
    const sql = `CREATE TABLE IF NOT EXISTS prosegurarrest (id_prosegurarrest int NOT NULL AUTO_INCREMENT, dateStart DATETIME, dateEnd DATETIME, plate VARCHAR (10), office VARCHAR (10), alias VARCHAR (50),
    stoppedTime VARCHAR(20), direction VARCHAR(250), detentionDistance DOUBLE, coordinates VARCHAR (250), PRIMARY KEY (id_prosegurarrest))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableProsegurPower() {
    const sql = `CREATE TABLE IF NOT EXISTS prosegurpower (id_prosegurpower int NOT NULL AUTO_INCREMENT, dateStart DATETIME, dateEnd DATETIME, plate VARCHAR (10), alias VARCHAR (50),
    stoppedTime VARCHAR(20), direction VARCHAR(250), detentionDistance double, coordinates VARCHAR (250), type VARCHAR(6), PRIMARY KEY (id_prosegurpower))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableProsegurMaintenance() {
    const sql = `CREATE TABLE IF NOT EXISTS prosegurmaintenance (id_prosegurmaintenance int NOT NULL AUTO_INCREMENT, car VARCHAR (25), brand VARCHAR (25), kmNow INT, 
    currentLocation VARCHAR (100), maintenanceDate DATETIME, kmMaintenance INT, typeWarning VARCHAR (25), kmElapsed INT, remaining INT, work VARCHAR (100), state VARCHAR (100), 
        PRIMARY KEY (id_prosegurmaintenance))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableAddressClient() {
    const sql = `CREATE TABLE IF NOT EXISTS addressclient (id_addressclient int NOT NULL AUTO_INCREMENT, 
      id_address int, id_client int, dateReg DATETIME NOT NULL, PRIMARY KEY (id_addressclient),
      FOREIGN KEY (id_address) REFERENCES address (id_address), FOREIGN KEY (id_client) REFERENCES client (id_client))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableContactClient() {
    const sql = `CREATE TABLE IF NOT EXISTS contactclient (id_contactclient int NOT NULL AUTO_INCREMENT, 
      id_contact int, id_client int, dateReg DATETIME NOT NULL, PRIMARY KEY (id_contactclient),
      FOREIGN KEY (id_contact) REFERENCES contact (id_contact), FOREIGN KEY (id_client) REFERENCES client (id_client))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableAddress() {
    const sql = `CREATE TABLE IF NOT EXISTS address (id_address int NOT NULL AUTO_INCREMENT, road VARCHAR (50), number int, zipcode VARCHAR (10),
        city VARCHAR (40), state VARCHAR (40), dateReg DATETIME NOT NULL, PRIMARY KEY (id_address))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableContact() {
    const sql = `CREATE TABLE IF NOT EXISTS contact (id_contact int NOT NULL AUTO_INCREMENT, name VARCHAR (40), 
        phone VARCHAR (20), taxregnr VARCHAR (20), mail VARCHAR (30), dateReg DATETIME NOT NULL, PRIMARY KEY (id_contact))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableOffice() {
    const sql = `CREATE TABLE IF NOT EXISTS office (id_office int NOT NULL AUTO_INCREMENT,code VARCHAR (05) NOT NULL, name VARCHAR (150) NOT NULL,
        status int NOT NULL, dateReg DATETIME NOT NULL, PRIMARY KEY (id_office))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableClient() {
    const sql = `CREATE TABLE IF NOT EXISTS client (id_client int NOT NULL AUTO_INCREMENT,name VARCHAR (150) NOT NULL,
        status int NOT NULL, dateReg DATETIME NOT NULL, PRIMARY KEY (id_client))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableLogin() {
    const sql = `CREATE TABLE IF NOT EXISTS login (id_login int NOT NULL AUTO_INCREMENT,mail VARCHAR (100) NOT NULL,
        password VARCHAR (250) NOT NULL, mailVerify int,  status int NOT NULL, dateReg DATETIME NOT NULL, PRIMARY KEY (id_login))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableUser() {
    const sql = `CREATE TABLE IF NOT EXISTS user (id_user int NOT NULL AUTO_INCREMENT,name VARCHAR (100) NOT NULL, perfil int NOT NULL, phone VARCHAR (45), cod INT, responsibility VARCHAR (75),
        modalidad VARCHAR (45), startCompany DATE, document VARCHAR (45), officecode INT, officename VARCHAR(45), endCompany DATE, sex VARCHAR(10),
        dateBirthday DATE, status int NOT NULL, dateReg DATETIME NOT NULL, id_login int NOT NULL, id_office int, 
        PRIMARY KEY (id_user), FOREIGN KEY (id_login) REFERENCES login(id_login), FOREIGN KEY (id_office) REFERENCES office(id_office))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableHistory() {
    const sql = `CREATE TABLE IF NOT EXISTS history (id_history int NOT NULL AUTO_INCREMENT, 
        description VARCHAR (50) NOT NULL, status int NOT NULL, dateReg DATETIME NOT NULL, id_login int NOT NULL, PRIMARY KEY (id_history),
        FOREIGN KEY (id_login) REFERENCES login(id_login))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableLabel() {
    const sql = `CREATE TABLE IF NOT EXISTS label (id_label int NOT NULL AUTO_INCREMENT, code VARCHAR (20) NOT NULL,
      name VARCHAR (30) NOT NULL, type VARCHAR (10), jerarquia VARCHAR (20) NOT NULL, dateReg DATETIME NOT NULL, PRIMARY KEY (id_label))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableItemGroup() {
    const sql = `CREATE TABLE IF NOT EXISTS itemGroup (id_itemGroup int NOT NULL AUTO_INCREMENT, code VARCHAR (20) NOT NULL,
      name VARCHAR (30) NOT NULL, vatcode VARCHAR (5), dateReg DATETIME NOT NULL, PRIMARY KEY (id_itemGroup))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableItem() {
    const sql = `CREATE TABLE IF NOT EXISTS item (id_item int NOT NULL AUTO_INCREMENT, code VARCHAR (100) NOT NULL,
      name VARCHAR (100) NOT NULL, brandCode VARCHAR (50) NOT NULL, unit VARCHAR (10), vatcode VARCHAR (5), type int, cost double, price double, 
      status int NOT NULL, dateReg DATETIME NOT NULL, id_label int NOT NULL, id_itemGroup int NOT NULL, PRIMARY KEY (id_item),
      FOREIGN KEY (id_label) REFERENCES label(id_label), FOREIGN KEY (id_itemGroup) REFERENCES itemGroup(id_itemGroup))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }
}

module.exports = new Tables