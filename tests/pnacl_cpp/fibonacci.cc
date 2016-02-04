// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include <string>

#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/var.h"
#include "ppapi/utility/completion_callback_factory.h"

#ifdef WIN32
#undef PostMessage
// Allow 'this' in initializer list
#pragma warning(disable : 4355)
#endif

int fibonacci(int n) {
	if (n < 2) {
		return n;
	}
	return fibonacci(n - 2) + fibonacci(n - 1);
}

/// The Instance class.  One of these exists for each instance of your NaCl
/// module on the web page.  The browser will ask the Module object to create
/// a new Instance for each occurrence of the <embed> tag that has these
/// attributes:
///     type="application/x-nacl"
///     src="file_histogram.nmf"
class CoreInstance : public pp::Instance {
 public:
  /// The constructor creates the plugin-side instance.
  /// @param[in] instance the handle to the browser-side plugin instance.
  explicit CoreInstance(PP_Instance instance)
      : pp::Instance(instance), callback_factory_(this) {}

 private:
  virtual void HandleMessage(const pp::Var& var_message) {
    int32_t number = var_message.AsInt();
    if (number) {
      int result = fibonacci(number);
      pp::Var msg(result);
      PostMessage(msg);
    } else {
      pp::Var msg(0);
      PostMessage(msg);
    }
  }
 private:
  pp::CompletionCallbackFactory<CoreInstance> callback_factory_;
};

class CoreModule : public pp::Module {
 public:
  CoreModule() : pp::Module() {}
  virtual ~CoreModule() {}

  virtual pp::Instance* CreateInstance(PP_Instance instance) {
    return new CoreInstance(instance);
  }
};

namespace pp {
Module* CreateModule() { return new CoreModule(); }
}  // namespace pp

