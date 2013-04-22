<?php

namespace DevPack;

/**
 * override default \Mongo_Collection from colinmollenhour
 * library to have better profiling effects when iterating
 */
class MongoCollection extends \Mongo_Collection
{
  public function findById($_id, $fields = [])
  {
    $result = parent::findOne(['_id' => new \MongoId($_id)], $fields);
    /*let use normal string as mongoid - php as default using \MongoId object
    //$result['_id'] = $result['_id']->{'$id'};*/
    return $result;
  }

  public function updateById($_id, $dataset, $safe = true)
  {
    if(!$_id instanceof \MongoId) {
      $_id = new \MongoId($_id);
    }
    if($safe) {
      return $this->update_safe(['_id' => $_id], $dataset);
    }
    else {
      return $this->update(['_id' => new $_id], $dataset);
    }
  }

  public function removeById($_id, $safe = true)
  {
    if(!$_id instanceof \MongoId) {
      $_id = new \MongoId($_id);
    }

    if($safe) {
      return $this->remove_safe(['_id' => $_id]);
    }
    else {
      return $this->remove(['_id' => new $_id]);
    }
  }

  private function start_iterate_profiling()
  {
    if($this->db()->profiling) {
      $this->_bm = $this->db()->profiler_start("Mongo_Database::$this->db", $this->inspect());
    }
  }

  private function check_iterate_profiling()
  {
    if( !$this->_cursor->hasNext() && isset( $this->_bm ) ) {
      $this->db()->profiler_stop( $this->_bm );
      unset( $this->_bm );
    }
  }

  public function toArray()
  {
    return $this->as_array();
  }

  /**
   * let by default elements iterating by default, Cursor way, or by Iterator interface
   * when we are in profiling mode
   */
  public function as_array( $objects = null )
  {
    $result = parent::as_array( $objects ?: $this->db()->profiling );

    foreach($result as $key => $element) {
      if(isset($element['_id'])) {
        //not every collection use mongoid on _id key
        if(!$element['_id'] instanceof \MongoId) break;

        $result[$key]['id'] = $element['_id']->{'$id'};
      }
    }

    return $result;
  }
  /**
   * Implement MongoCursor#hasNext to ensure that the cursor is loaded
   *
   * @return  bool
   */
  public function hasNext()
  {
    if( !$this->is_iterating() ) $this->start_iterate_profiling();

    return $this->cursor()->hasNext();
  }

  /**
   * adding one profiler_start method, removing profiler_stop
   * Iterator: rewind
   */
  public function rewind()
  {
    try
    {
      $this->start_iterate_profiling();
      $this->cursor()->rewind();
    }
    catch(MongoCursorException $e) {
      throw new MongoCursorException("{$e->getMessage()}: {$this->inspect()}", $e->getCode());
    }
    catch(MongoException $e) {
      throw new MongoException("{$e->getMessage()}: {$this->inspect()}", $e->getCode());
    }
  }

  /**
   * removing profiler_stop when check current (when iterate)
   * Iterator: current
   *
   * @return array|Mongo_Document
   */
  public function current()
  {
    $data = $this->_cursor->current();
    $this->check_iterate_profiling();

    if( ! $this->_model)
    {
      return $data;
    }
    $model = clone $this->get_model();
    return $model->load_values($data,TRUE);
  }
}