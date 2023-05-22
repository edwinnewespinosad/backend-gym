CREATE DATABASE IF NOT EXISTS gym;

use gym;

CREATE TABLE role_user(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

CREATE TABLE user(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(10),
    active BOOLEAN DEFAULT true,
    fk_id_role_user INTEGER,
    FOREIGN KEY (fk_id_role_user) REFERENCES role_user(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membership(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    duration VARCHAR(255),
    price FLOAT,
    benefits VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE client(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(10),
    active BOOLEAN DEFAULT true,
    fk_id_memberhsip INTEGER,
    FOREIGN KEY (fk_id_memberhsip) REFERENCES membership(id),
    fk_id_role_user INTEGER,
    FOREIGN KEY (fk_id_role_user) REFERENCES role_user(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE instructor(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    image VARCHAR(255),
    name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(10),
    active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membership_purchase (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  fk_id_membership INT NOT NULL,
  fk_id_client INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (fk_id_membership) REFERENCES membership(id),
  FOREIGN KEY (fk_id_client) REFERENCES client(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goals (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  fk_id_client INT NOT NULL,
  active BOOLEAN DEFAULT false,
  FOREIGN KEY (fk_id_client) REFERENCES client(id)
);

CREATE TABLE routine (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    description VARCHAR(100)
);

CREATE TABLE client_has_routine (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day VARCHAR(20),
    series VARCHAR(10),
    repetitions VARCHAR(20),
    weight VARCHAR(10),
    fk_id_client INT,
    fk_id_routine INT,
    FOREIGN KEY (fk_id_client) REFERENCES client(id),
    FOREIGN KEY (fk_id_routine) REFERENCES routine(id)
);

CREATE TABLE client_has_sizes (
  id INT AUTO_INCREMENT NOT NULL,
  date DATE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  height DECIMAL(4,2) NOT NULL,
  chest DECIMAL(4,2),
  waist DECIMAL(4,2),
  thigh DECIMAL(4,2),
  bicep DECIMAL(4,2),
  imc DECIMAL(5,2),
  fk_id_client INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (fk_id_client) REFERENCES client(id)
);