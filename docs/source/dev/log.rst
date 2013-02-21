=======
Logging
=======

Logs are needed to make developing process easier and have place where you can
check critical application errors info when you can not repeat it by youself.
Zend framework 2 provide nice logging classes, you can read about it in
`official zf2 manual`_.

.. _`official zf2 manual`: http://framework.zend.com/manual/2.0/en/modules/zend.log.overview.html

In Alcarin game you can get logger class by 'system-logger' key.

.. code-block:: php

    <?php

    $logger = $service_manager->get('system-logger');
    $logger->debug('test debug message');

You can use all standard *\\Zend\\Log\\Logger* methods, like *debug*, *info*, *warn* etc.
To configure you local log system you should edit following lines in you *local.php* file:

.. code-block:: php

    <?php
    return array(
        ...
        'logs'  => array(
            'writers'   => array(
                'mongo-log-writer' => array(
                    'service'       => 'mongo-log-writer',
                    'min-priority'  => Zend\Log\Logger::ERR,
                ),
                'stream'    => array(
                    'type'         => 'stream',
                    'stream'       => __DIR__ . '/../../data/logs/alcarin.log',
                    'min-priority' => Zend\Log\Logger::INFO,
                ),
                'debug-stream'    => array(
                    'type'   => 'stream',
                    'stream' => __DIR__ . '/../../data/logs/debug.log',
                ),
            )
        ),


In this sample I added 3 logging output writers:
    - *'mongo-log-writer'* - alcarin logger, log things to default mongo database, to "logs" table
    - *'stream' - simple log to file, but only **information** and more priority logs
    - *'debug-stream' - simple log to file all logs

Of course you can define you own writers, read more in zf2 docs if you want it. Remember that
you php server need write privilages to output files.

If you work on UNIX system it would make you job easier to follow all logs in realtime. If
you define loggers like in sample, you can do this by use tail unix cmd.

.. code-block:: shell

    cd /alcarin/project/dir
    tail -f data/logs/debug.log