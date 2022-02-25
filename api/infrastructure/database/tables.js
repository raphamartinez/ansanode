
class Tables {

  init(connection) {
    this.connection = connection
    this.createTableFinanceInvoice()
    this.createTableItemPrice()
    this.createTableGoal()
    this.createTableGoalLines()
    this.createTableSalesman()
    this.createTableCompanyAssets()
    this.createTablemailattachment()
    this.createTableMailScheduling()
    this.createTableMailUser()
    this.createTableStock()
    this.createTableType()
    this.createTableFile()
    this.createTableReceivable()
    this.createTableSalary()
    this.createTableWebscrapingHistory()
    this.createTableProsegurDistance()
    this.createTableInviolavelOffice()
    this.createTableProsegurOffice()
    this.createTableProsegurArrest()
    this.createTableProsegurPower()
    this.createTableProsegurMaintenance()
    this.createTableOffice()
    this.createTableLogin()
    this.createTableUser()
    this.createTableHistory()
    this.createTablePowerBI()
    this.createTableViewPowerBI()
    this.createTableUserHbs()
    this.createTableOfficeUser()
    this.createTableQuiz()
    this.createTableQuestion()
    this.createTableAnswer()
    this.createTableInterview()
    this.createTableAnsweredInterview()
    this.createTablePatrimonyImage()
    this.createTablePatrimonyDetails()
    this.createTableCrm()
    this.createTableCrmProducts()
    this.createTableProsegurUser()
    this.createTableMailPeriod()
    
    return true
  }

  createTableFinanceExpected() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.financeexpected (id int NOT NULL AUTO_INCREMENT, 
      client int, date DATE, datereg DATETIME, id_login int, office VARCHAR(5), transfUsd double, chequeUsd double, transfGs double, chequeGs double,
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableProsegurUser() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.prosegurusers (id int NOT NULL AUTO_INCREMENT, 
      code int, name VARCHAR(250), office VARCHAR(5),
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableCrmProducts() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.crmproducts (id int NOT NULL AUTO_INCREMENT, 
      code VARCHAR(20), name VARCHAR(250), type VARCHAR (10), classification int, id_crm int,
      FOREIGN KEY (id_crm) REFERENCES crm (id), 
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableCrm() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.crm (id int NOT NULL AUTO_INCREMENT, 
      client VARCHAR(100), name VARCHAR (100), phone VARCHAR (20), mail VARCHAR (75), description VARCHAR (250),
      contactdate DATETIME, datereg DATETIME, status int, id_login int,
      FOREIGN KEY (id_login) REFERENCES login (id_login), 
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTablePatrimonyDetails() {
    const sql = `CREATE TABLE IF NOT EXISTS patrimonydetails (id int NOT NULL AUTO_INCREMENT, title VARCHAR (50), description VARCHAR (250), id_patrimony int NOT NULL, datereg DATETIME, 
    FOREIGN KEY (id_patrimony) REFERENCES companyassets (id_companyassets), PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTablePatrimonyImage() {
    const sql = `CREATE TABLE IF NOT EXISTS patrimonyimage (id int NOT NULL AUTO_INCREMENT, url VARCHAR (250), id_patrimony int NOT NULL, datereg DATETIME, 
    FOREIGN KEY (id_patrimony) REFERENCES companyassets (id_companyassets), PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableAnsweredInterview() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.answeredinterview (id int NOT NULL AUTO_INCREMENT, 
      id_answer int, id_question int, id_interview int, value int, 
      FOREIGN KEY (id_answer) REFERENCES answer (id), 
      FOREIGN KEY (id_question) REFERENCES question (id), 
      FOREIGN KEY (id_interview) REFERENCES interview (id), 
      PRIMARY KEY (id))`


    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableInterview() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.interview (id int NOT NULL AUTO_INCREMENT, 
      id_quiz int, mail VARCHAR(100), name VARCHAR(50), comment VARCHAR(250), datereg DATETIME, status int, id_login int,
      FOREIGN KEY (id_login) REFERENCES login (id_login), 
      FOREIGN KEY (id_quiz) REFERENCES quiz (id), 
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }


  createTableAnswer() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.answer (id int NOT NULL AUTO_INCREMENT, 
      title VARCHAR (250), id_question int, classification int, FOREIGN KEY (id_question) REFERENCES question (id),  
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableQuestion() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.question (id int NOT NULL AUTO_INCREMENT, 
      title VARCHAR (150), classification int, type VARCHAR (20), id_quiz int, FOREIGN KEY (id_quiz) REFERENCES quiz (id),  
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableQuiz() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.quiz (id int NOT NULL AUTO_INCREMENT, 
      title VARCHAR(500), datereg DATETIME, status int, PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableFinanceInvoice() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.financeinvoice (id_financeinvoice int NOT NULL AUTO_INCREMENT, 
      invoicenr int, comment VARCHAR(250), contact VARCHAR (150), responsible VARCHAR (150), status int, id_login int,
      payday DATE, contactdate DATETIME, datereg DATETIME, 
      FOREIGN KEY (id_login) REFERENCES login (id_login), 
      PRIMARY KEY (id_financeinvoice))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableItemPrice() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.itemprice (id int NOT NULL AUTO_INCREMENT, code VARCHAR (100), price DOUBLE, PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableItemStock() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.itemstock (id int NOT NULL AUTO_INCREMENT, code VARCHAR (100), qty int, reserved int, deposit VARCHAR(20), PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableGoal() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.goal (id_goal int NOT NULL AUTO_INCREMENT,
      id_goalline int, amount int, id_salesman INT, FOREIGN KEY (id_salesman) REFERENCES salesman (id_salesman), 
      FOREIGN KEY (id_goalline) REFERENCES goalline (id_goalline), PRIMARY KEY (id_goal))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableGoalLines() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.goalline (id_goalline int NOT NULL AUTO_INCREMENT, itemgroup VARCHAR(250), provider VARCHAR (250),
    date DATE, application VARCHAR (250), labelname VARCHAR (250), labelcode VARCHAR (50), PRIMARY KEY (id_goalline))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableLabel() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.label (id_label int NOT NULL AUTO_INCREMENT, label VARCHAR(100), 
    provider VARCHAR (250), product VARCHAR (250), PRIMARY KEY (id_label))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableSalesman() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.salesman (id_salesman int NOT NULL AUTO_INCREMENT, office int,
    name VARCHAR (250), code VARCHAR (100), dateReg DATETIME, id_login int, FOREIGN KEY (id_login) REFERENCES login (id_login),
    PRIMARY KEY (id_salesman))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }


  createTableCompanyAssets() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.companyassets (id_companyassets int NOT NULL AUTO_INCREMENT, plate VARCHAR(50), responseId int,
    name VARCHAR (250), description VARCHAR (250), type VARCHAR (45), note VARCHAR (250), title VARCHAR (250), office VARCHAR(10), PRIMARY KEY (id_companyassets))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }


  createTablemailattachment() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.mailattachment (id_mailattachment int NOT NULL AUTO_INCREMENT,
      url VARCHAR (250), id_mailpowerbi int,FOREIGN KEY (id_mailpowerbi) REFERENCES mailpowerbi (id_mailpowerbi), PRIMARY KEY (id_mailattachment))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableMailPeriod() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.mailperiod (id int NOT NULL AUTO_INCREMENT, datestart DATE,  dateend DATE, weekday int,
      id_mailpowerbi int, FOREIGN KEY (id_mailpowerbi) REFERENCES mailpowerbi (id_mailpowerbi), PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableMailScheduling() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.mailscheduling (id_mailscheduling int NOT NULL AUTO_INCREMENT, date DATETIME
      , id_mailpowerbi int,FOREIGN KEY (id_mailpowerbi) REFERENCES mailpowerbi (id_mailpowerbi), PRIMARY KEY (id_mailscheduling))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableMailUser() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.mailpowerbi (id_mailpowerbi int NOT NULL AUTO_INCREMENT, recipients VARCHAR(250), cc VARCHAR(250), cco VARCHAR(250), title VARCHAR (100), body VARCHAR (250),
    type int, datereg DATETIME, id_login int, FOREIGN KEY (id_login) REFERENCES login (id_login), PRIMARY KEY (id_mailpowerbi))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableStock() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.stock (id_stock int NOT NULL AUTO_INCREMENT, name VARCHAR (100), id_login int, FOREIGN KEY (id_login) REFERENCES login (id_login), PRIMARY KEY (id_stock))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableType() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.type (id_type int NOT NULL AUTO_INCREMENT, name VARCHAR (100), PRIMARY KEY (id_type))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableFile() {
    const sql = `CREATE TABLE IF NOT EXISTS file (id_file int NOT NULL AUTO_INCREMENT, filename VARCHAR (250), mimetype VARCHAR (30) NOT NULL,
    description VARCHAR (250), title VARCHAR (90) NOT NULL,
    type int, path VARCHAR (250) NOT NULL, size int, id_login int, datereg DATETIME, 
    FOREIGN KEY (id_login) REFERENCES login (id_login), PRIMARY KEY (id_file))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableClockMachine() {
    const sql = `CREATE TABLE IF NOT EXISTS clockmachine (id_clock int NOT NULL AUTO_INCREMENT,EmployeeCode int NOT NULL, Date VARCHAR (45), TimestampDate DATETIME,
        Type int, Office VARCHAR (05), Name VARCHAR (100), PRIMARY KEY (id_clock))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }


  createTableUserHbs() {
    const sql = `CREATE TABLE IF NOT EXISTS userhbs (id_user int NOT NULL AUTO_INCREMENT,name VARCHAR (100) NOT NULL, perfil int NOT NULL, phone VARCHAR (45), cod INT, responsibility VARCHAR (75),
        modalidad VARCHAR (45), startCompany DATE, document VARCHAR (45), officecode INT, officename VARCHAR(45), endCompany DATE, sex VARCHAR(10),
        dateBirthday DATE, status int NOT NULL, dateReg DATETIME NOT NULL, id_login int NOT NULL, id_office VARCHAR(10), PRIMARY KEY (id_user))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableReceivable() {
    const sql = `CREATE TABLE IF NOT EXISTS receivable (id_receivable int NOT NULL AUTO_INCREMENT, SerNr double, date DATETIME, DueDate date,
     InstallNr VARCHAR (25), InvoiceType VARCHAR (5), Type VARCHAR (15), SaldoInv double, DocType VARCHAR (45), FromRate double,
     SalesMan VARCHAR (250), SalesManName VARCHAR (250), CustCode int, PayTerm VARCHAR (5), CustName VARCHAR (150), OfficialSerNr VARCHAR (100), 
     Currency VARCHAR (5),  CurrencyRate double, BaseRate double,  Total double, BankName varchar(25),
     Saldo double, Office VARCHAR(5), Comment VARCHAR (250), CustGroup VARCHAR (15), PRIMARY KEY (id_receivable))`

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
    type int, token VARCHAR (250), description VARCHAR (250), idreport VARCHAR (100), dateReg DATETIME NOT NULL, PRIMARY KEY (id_powerbi))`

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

  createTableOfficeUser() {
    const sql = `CREATE TABLE IF NOT EXISTS ansa.officeuser (id int NOT NULL AUTO_INCREMENT, id_login int, id_office int,
      FOREIGN KEY (id_login) REFERENCES login (id_login), 
      FOREIGN KEY (id_office) REFERENCES office (id_office), 
            PRIMARY KEY (id))
      `

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