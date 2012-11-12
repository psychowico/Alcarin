# A Guardfile, is responsible for the automatic page reloading
# when our less or css files are changed and automatic
# compilation of coffee and less files.
# More info at https://github.com/guard/guard#readme

guard 'livereload', :port => '35729' do
  watch(%r{^public/.+\.(css|js)})
  watch(%r{^module/.+\.(phtml|twig)})
  watch(%r{^docs/build/html/.+\.html})
end

guard :shell do
  watch(%r{^docs/source.+\.rst}){ `make html -C ./docs` }
end

guard 'less', :all_on_start => false, :output => 'public/css/compiled_less',
              :import_paths => ['module/Web/Alcarin/static/less/libs'] do
  watch(%r{^module/.+/static/less/(.+\.less)})
end

guard 'coffeescript', :output => 'public/js/compiled_coffee',
                      :shallow => false, :bare => true do
  watch(%r{^module/.+/static/coffee/(.+\.coffee)})
end