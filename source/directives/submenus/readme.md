## Task Submenu Directive

Attribute directive. Should be used inside of tasks ng-repeat

### Usage

```
<div class="task-item" ng-repeat="task in tp.tasks">
    <!-- ... -->
    <div class="submenu-btn submenu-btn__task-item" task-submenu>
        <i class="fa fa-cog"></i>
    </div>
</div>
```