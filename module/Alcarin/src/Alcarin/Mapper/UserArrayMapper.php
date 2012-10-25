<?php

namespace Alcarin\Mapper;

use ZfcUser\Entity\UserInterface;

class UserArrayMapper implements UserInterface
                     //, ArraySerializableInterface

{
    protected $data = [
        'username'     => null,
        'display_name' => null,
        'password'     => null,
        'email'        => null,
    ];

    public function __construct($array = null)
    {
        if( !empty($array) ) $this->data = $array;
    }

    /*public function set_Id($id)
    {
        \Zend\Debug\Debug::dump( 'id: ' . $id );
        exit;
    }*/

    public function getArrayCopy()
    {
        return $this->data;
    }

    public function exchangeArray( array $data )
    {
        $this->data = $data;
        if( isset( $this->data['_id'] ) ) {
            $this->data['_id'] = (string)$this->data['_id'] ;
        }
        return $this;
    }

    /**
     * Get id.
     *
     * @return string
     */
    public function getId()
    {
        return isset( $this->data['_id'] ) ? $this->data['_id'] : null;
    }

    /**
     * Set id.
     *
     * @param string $id
     * @return UserInterface
     */
    public function set_id($id)
    {
        $this->data['_id'] = (string)$id;
        return $this;
    }

    /**
     * Set id.
     *
     * @param string $id
     * @return UserInterface
     */
    public function setId($id)
    {
        $this->data['_id'] = $id;
        return $this;
    }

    /**
     * Get username.
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->data['username'];
    }

    /**
     * Set username.
     *
     * @param string $username
     * @return UserInterface
     */
    public function setUsername($username)
    {
        $this->data['username'] = $username;
        return $this;
    }

    /**
     * Get email.
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->data['email'];
    }

    /**
     * Set email.
     *
     * @param string $email
     * @return UserInterface
     */
    public function setEmail($email)
    {
        $this->data['email'] = $email;
        return $this;
    }

    /**
     * Get displayName.
     *
     * @return string
     */
    public function getDisplayName()
    {
        return $this->data['display_name'];
    }

    /**
     * Set displayName.
     *
     * @param string $displayName
     * @return UserInterface
     */
    public function setDisplayName($displayName)
    {
        $this->data['display_name'] = $displayName;
        return $this;
    }

    /**
     * Get password.
     *
     * @return string password
     */
    public function getPassword()
    {
        return $this->data['password'];
    }

    /**
     * Set password.
     *
     * @param string $password
     * @return UserInterface
     */
    public function setPassword($password)
    {
        $this->data['password'] = $password;
        return $this;
    }
}